import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp,
  Calendar,
  ExternalLink,
  AlertTriangle,
  Info
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { useMinistry } from '../hooks/useApi'
import { budgetApi } from '../services/api'
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingStates'
import { formatCurrency, formatPercentage, generateColors } from '../utils/formatters'

const MinistryDetail = () => {
  const { code } = useParams()
  const [selectedYear, setSelectedYear] = useState(2025)
  const [agricultureDetails, setAgricultureDetails] = useState(null)
  const [loadingAgriculture, setLoadingAgriculture] = useState(false)
  
  const { data: ministryData, isLoading, error, refetch } = useMinistry(code, selectedYear)

  // Fetch detailed agriculture data if this is the agriculture ministry
  useEffect(() => {
    if (code === 'AGRICULTURA' && selectedYear === 2024) {
      setLoadingAgriculture(true)
      budgetApi.getAgricultureDetails(selectedYear)
        .then(response => {
          setAgricultureDetails(response.data.data)
        })
        .catch(error => {
          console.error('Error fetching agriculture details:', error)
        })
        .finally(() => {
          setLoadingAgriculture(false)
        })
    } else {
      setAgricultureDetails(null)
    }
  }, [code, selectedYear])

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010]

  if (isLoading) {
    return <LoadingSpinner text="Cargando detalles del ministerio..." />
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />
  }

  const ministry = ministryData?.data
  if (!ministry) {
    return <ErrorMessage error={{ message: 'Ministerio no encontrado' }} />
  }

  // Prepare data for charts
  const expenseBreakdown = [
    { name: 'Personal', value: ministry.details.personnel, percentage: 60 },
    { name: 'Programas', value: ministry.details.programs, percentage: 30 },
    { name: 'Inversión', value: ministry.details.investment, percentage: 10 }
  ]

  const colors = generateColors(expenseBreakdown.length)

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/ministries" className="hover:text-primary-600 flex items-center space-x-1">
          <ArrowLeft className="w-4 h-4" />
          <span>Ministerios</span>
        </Link>
        <span>/</span>
        <span className="text-gray-900">{ministry.name}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{ministry.name}</h1>
          <p className="text-gray-600 mt-1">
            Código: {ministry.code} • Año {selectedYear}
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="select-field w-32"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Presupuesto Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(ministry.budget)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">% del Presupuesto</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(ministry.percentage)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Gasto en Personal</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(ministry.details.personnel)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Briefcase className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Programas</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(ministry.details.programs)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expense Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              Distribución del Presupuesto
            </h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${formatPercentage(percentage)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [formatCurrency(value), 'Monto']} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Trend */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              Evolución Histórica
            </h2>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={ministry.historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => formatCurrency(value, 'CLP').replace('$', '$').slice(0, -4) + 'B'} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value), 'Presupuesto']}
                labelFormatter={(label) => `Año ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="budget" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Desglose Detallado del Presupuesto
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % del Ministerio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenseBreakdown.map((expense, index) => (
                <tr key={expense.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: colors[index] }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {expense.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(expense.value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPercentage(expense.percentage)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {expense.name === 'Personal' && 'Sueldos, salarios y beneficios del personal'}
                    {expense.name === 'Programas' && 'Programas sociales y operacionales'}
                    {expense.name === 'Inversión' && 'Inversión en infraestructura y equipamiento'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Data Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Datos Históricos
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variación
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ministry.historicalData.map((yearData, index) => {
                const previousYear = ministry.historicalData[index - 1]
                const variation = previousYear 
                  ? ((yearData.budget - previousYear.budget) / previousYear.budget) * 100
                  : 0

                return (
                  <tr key={yearData.year} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {yearData.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(yearData.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {index === 0 ? (
                        <span className="text-gray-500">-</span>
                      ) : (
                        <span className={variation >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {variation >= 0 ? '+' : ''}{formatPercentage(variation)}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900">
              Información del Ministerio
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Los datos mostrados corresponden al presupuesto oficial asignado a {ministry.name} 
              para el año {selectedYear}. La información histórica permite analizar la evolución 
              del presupuesto a lo largo del tiempo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MinistryDetail
