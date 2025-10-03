import { useState } from 'react'
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Users,
  Calendar,
  ExternalLink
} from 'lucide-react'
import { useBudget, useEconomicData, useMinistries, useExpenses } from '../hooks/useApi'
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingStates'
import DataSourceIndicator from '../components/common/DataSourceIndicator'
import { formatCurrency, formatLargeNumber, formatPercentage, generateColors } from '../utils/formatters'

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2025)
  
  const { data: budgetData, isLoading: budgetLoading, error: budgetError } = useBudget(selectedYear)
  const { data: economicData, isLoading: economicLoading, error: economicError } = useEconomicData(selectedYear)
  const { data: ministriesData, isLoading: ministriesLoading } = useMinistries(selectedYear)
  const { data: expensesData, isLoading: expensesLoading } = useExpenses(selectedYear)

  const years = [2025, 2024, 2023, 2022, 2021, 2020]

  if (budgetLoading || economicLoading) {
    return <LoadingSpinner text="Cargando dashboard..." />
  }

  if (budgetError || economicError) {
    return <ErrorMessage error={budgetError || economicError} />
  }

  const budget = budgetData?.data
  const economic = economicData?.data
  const ministries = ministriesData?.data?.ministries || []
  const expenses = expensesData?.data?.expenses

  // Prepare data for charts
  const topMinistries = ministries.slice(0, 8)
  const chartColors = generateColors(topMinistries.length)

  const expenseData = expenses ? [
    { name: 'Personal', value: expenses.personnel.amount, percentage: expenses.personnel.percentage },
    { name: 'Programas', value: expenses.programs.amount, percentage: expenses.programs.percentage },
    { name: 'Inversión', value: expenses.investment.amount, percentage: expenses.investment.percentage }
  ] : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Presupuesto Público</h1>
          <p className="text-gray-600 mt-1">
            Visualización transparente del presupuesto nacional de Chile
          </p>
          <div className="mt-3">
            <DataSourceIndicator 
              year={selectedYear}
              source={budget?.source || 'Cargando...'}
              isRealData={budget?.isRealData || false}
              lastUpdated={budget?.lastUpdated}
            />
          </div>
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
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Presupuesto Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatLargeNumber(budget?.totalBudget)}
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
              <p className="text-sm font-medium text-gray-600">PIB Nacional</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatLargeNumber(economic?.gdp?.value)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Ministerios</p>
              <p className="text-2xl font-bold text-gray-900">{ministries.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Crecimiento PIB</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(economic?.gdp?.growth)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Budget by Ministry */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              Presupuesto por Ministerio
            </h2>
          </div>
          
          {ministriesLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topMinistries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => formatLargeNumber(value)}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Presupuesto']}
                  labelFormatter={(label) => `Ministerio: ${label}`}
                />
                <Bar dataKey="budget" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Expense Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              Distribución del Gasto
            </h2>
          </div>
          
          {expensesLoading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${formatPercentage(percentage)}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatCurrency(value), 'Monto']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Ministries Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Principales Ministerios {selectedYear}
          </h2>
          <a 
            href="/ministries" 
            className="text-primary-600 hover:text-primary-700 flex items-center space-x-1 text-sm"
          >
            <span>Ver todos</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ministerio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuesto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % del Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topMinistries.map((ministry, index) => (
                <tr key={ministry.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-3 h-3 rounded-full mr-3"
                        style={{ backgroundColor: chartColors[index] }}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {ministry.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(ministry.budget)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPercentage(ministry.percentage)}
                  </td>
                </tr>
              ))}
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
              Datos Actualizados - {selectedYear}
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              La información mostrada corresponde al presupuesto oficial {selectedYear} 
              {budget?.source && ` de ${budget.source}`}. 
              {budget?.growth && ` Crecimiento: ${formatPercentage(budget.growth)} respecto al año anterior.`}
              {budget?.note && (
                <span className="block mt-2 text-blue-600 font-medium">
                  📊 {budget.note}
                </span>
              )}
            </p>
            {budget?.sourceUrl && (
              <a 
                href={budget.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
              >
                <span>Ver fuente oficial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

