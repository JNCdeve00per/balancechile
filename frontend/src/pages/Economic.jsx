import { useState } from 'react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts'
import { 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Users,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { useEconomicData, useGDP } from '../hooks/useApi'
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingStates'
import { formatCurrency, formatPercentage, formatLargeNumber } from '../utils/formatters'

const Economic = () => {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [gdpRange, setGdpRange] = useState(5)
  
  const { data: economicData, isLoading: economicLoading, error: economicError } = useEconomicData(selectedYear)
  const { data: gdpData, isLoading: gdpLoading, error: gdpError } = useGDP(selectedYear, gdpRange)

  const years = [2025, 2024, 2023, 2022, 2021, 2020]
  const ranges = [
    { value: 5, label: '5 años' },
    { value: 10, label: '10 años' },
    { value: 15, label: '15 años' }
  ]

  if (economicLoading || gdpLoading) {
    return <LoadingSpinner text="Cargando datos económicos..." />
  }

  if (economicError || gdpError) {
    return <ErrorMessage error={economicError || gdpError} />
  }

  const economic = economicData?.data
  const gdp = gdpData?.data

  // Mock additional economic indicators
  const economicIndicators = [
    {
      name: 'Inflación',
      value: economic?.inflation || 3.8,
      unit: '%',
      trend: 'down',
      description: 'Variación anual IPC'
    },
    {
      name: 'Desempleo',
      value: economic?.unemployment || 7.2,
      unit: '%',
      trend: 'up',
      description: 'Tasa de desocupación nacional'
    },
    {
      name: 'Deuda Pública',
      value: economic?.publicDebt?.percentage || 30.5,
      unit: '%',
      trend: 'up',
      description: '% del PIB'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Indicadores Económicos</h1>
          <p className="text-gray-600 mt-1">
            Datos macroeconómicos de Chile - Banco Central y organismos oficiales
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="select-field w-32"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <select
            value={gdpRange}
            onChange={(e) => setGdpRange(parseInt(e.target.value))}
            className="select-field w-32"
          >
            {ranges.map(range => (
              <option key={range.value} value={range.value}>{range.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Economic Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">PIB {selectedYear}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatLargeNumber(gdp?.current?.gdp)} USD
              </p>
              <div className="flex items-center mt-1">
                {gdp?.current?.growth >= 0 ? (
                  <ArrowUp className="w-3 h-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="w-3 h-3 text-red-500 mr-1" />
                )}
                <span className={`text-xs ${gdp?.current?.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(gdp?.current?.growth)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {economicIndicators.map((indicator, index) => (
          <div key={indicator.name} className="card">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${
                index === 0 ? 'bg-orange-100' : 
                index === 1 ? 'bg-red-100' : 'bg-yellow-100'
              }`}>
                {index === 0 && <Percent className="w-6 h-6 text-orange-600" />}
                {index === 1 && <Users className="w-6 h-6 text-red-600" />}
                {index === 2 && <TrendingUp className="w-6 h-6 text-yellow-600" />}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{indicator.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {indicator.value}{indicator.unit}
                </p>
                <p className="text-xs text-gray-500 mt-1">{indicator.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* GDP Evolution Chart */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Evolución del PIB ({gdpRange} años)
          </h2>
          <div className="text-sm text-gray-600">
            Crecimiento promedio: {formatPercentage(gdp?.average_growth)}
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={gdp?.history || []}>
            <defs>
              <linearGradient id="gdpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis 
              tickFormatter={(value) => `$${formatLargeNumber(value)}`}
            />
            <Tooltip 
              formatter={(value) => [formatCurrency(value, 'USD'), 'PIB']}
              labelFormatter={(label) => `Año ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="gdp" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#gdpGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* GDP Growth Rate */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Tasa de Crecimiento del PIB
          </h2>
        </div>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={gdp?.history || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value) => [formatPercentage(value), 'Crecimiento']}
              labelFormatter={(label) => `Año ${label}`}
            />
            <Bar 
              dataKey="growth" 
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Economic Indicators Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inflation Trend */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              Tendencia Inflación
            </h2>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              { year: 2020, inflation: 3.0 },
              { year: 2021, inflation: 4.5 },
              { year: 2022, inflation: 11.6 },
              { year: 2023, inflation: 4.1 },
              { year: 2024, inflation: 3.8 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value) => [formatPercentage(value), 'Inflación']}
                labelFormatter={(label) => `Año ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="inflation" 
                stroke="#f59e0b" 
                strokeWidth={3}
                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Unemployment Rate */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">
              Tasa de Desempleo
            </h2>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={[
              { year: 2020, unemployment: 11.2 },
              { year: 2021, unemployment: 8.9 },
              { year: 2022, unemployment: 7.9 },
              { year: 2023, unemployment: 8.1 },
              { year: 2024, unemployment: 7.2 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip 
                formatter={(value) => [formatPercentage(value), 'Desempleo']}
                labelFormatter={(label) => `Año ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="unemployment" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Economic Summary Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Resumen Económico {selectedYear}
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Indicador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tendencia
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Producto Interno Bruto
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatLargeNumber(gdp?.current?.gdp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  USD (miles de millones)
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {gdp?.current?.growth >= 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={gdp?.current?.growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatPercentage(gdp?.current?.growth)}
                    </span>
                  </div>
                </td>
              </tr>
              
              {economicIndicators.map((indicator) => (
                <tr key={indicator.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {indicator.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {indicator.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {indicator.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      {indicator.trend === 'up' ? (
                        <ArrowUp className="w-4 h-4 text-red-500 mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-green-500 mr-1" />
                      )}
                      <span className={indicator.trend === 'up' ? 'text-red-600' : 'text-green-600'}>
                        {indicator.trend === 'up' ? 'Subiendo' : 'Bajando'}
                      </span>
                    </div>
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
              Fuentes de Datos Económicos
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Los datos económicos provienen del Banco Central de Chile, INE y organismos 
              oficiales. El PIB se presenta en dólares estadounidenses a precios corrientes. 
              Los indicadores se actualizan mensual o trimestralmente según disponibilidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Economic
