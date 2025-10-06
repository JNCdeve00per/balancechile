import { useState, useEffect } from 'react'
import { ExternalLink, CheckCircle, Calendar, Database, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { budgetApi } from '../services/api'
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingStates'
import { formatCurrency } from '../utils/formatters'

const DataSources = () => {
  const [sources, setSources] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(null)

  const years = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010]

  useEffect(() => {
    budgetApi.getDataSources()
      .then(response => {
        setSources(response.data.data)
      })
      .catch(error => {
        console.error('Error fetching data sources:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const budgetData = {
    2025: { budget: 88000000000000, status: 'projected' },
    2024: { budget: 76918639000000, status: 'integrated' },
    2023: { budget: 70800000000000, status: 'integrated' },
    2022: { budget: 64000000000000, status: 'integrated' },
    2021: { budget: 60000000000000, status: 'integrated' },
    2020: { budget: 58000000000000, status: 'integrated' },
    2019: { budget: 55000000000000, status: 'integrated' },
    2018: { budget: 53200000000000, status: 'integrated' },
    2017: { budget: 51800000000000, status: 'integrated' },
    2016: { budget: 49500000000000, status: 'integrated' },
    2015: { budget: 48000000000000, status: 'integrated' },
    2014: { budget: 46600000000000, status: 'integrated' },
    2013: { budget: 44300000000000, status: 'integrated' },
    2012: { budget: 42200000000000, status: 'integrated' },
    2011: { budget: 39800000000000, status: 'integrated' },
    2010: { budget: 37100000000000, status: 'integrated' }
  }

  if (loading) {
    return <LoadingSpinner text="Cargando fuentes de datos..." />
  }

  if (!sources) {
    return <ErrorMessage error={{ message: 'Error cargando fuentes de datos' }} />
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'integrated':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'projected':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'available':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'integrated':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'projected':
        return <TrendingUp className="w-4 h-4 text-blue-600" />
      default:
        return <Database className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Fuentes de Datos Presupuestarios</h1>
        <p className="text-gray-600 mt-2">
          Transparencia y trazabilidad de los datos utilizados en Balance Chile
        </p>
      </div>

      {/* BCN Integration Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Integración BCN Activa</h2>
            </div>
            <p className="text-blue-100 mb-4">
              Ahora puedes acceder a los datos oficiales de la Biblioteca del Congreso Nacional de Chile 
              directamente desde nuestra plataforma. Información detallada de partidas presupuestarias 
              para todos los años disponibles (2010-2026).
            </p>
            <Link 
              to="/bcn"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Ver Datos BCN <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Current Status Overview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Database className="w-6 h-6 text-blue-600 mt-1" />
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Estado Actual del Sistema</h2>
            <p className="text-blue-700 mt-1">{sources.currentStatus.note}</p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-blue-900">Fuentes Integradas:</h3>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  {sources.currentStatus.integratedSources.map((source, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Pendientes de Integración:</h3>
                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                  {sources.currentStatus.pendingIntegration.map((source, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Calendar className="w-3 h-3 text-yellow-600" />
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">
            Serie Histórica de Presupuestos (2010-2025)
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Evolución del presupuesto nacional chileno con fuentes oficiales
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presupuesto Nacional
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fuente
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {years.map((year, index) => {
                const yearData = budgetData[year]
                const previousYear = budgetData[years[index + 1]]
                const variation = previousYear 
                  ? ((yearData.budget - previousYear.budget) / previousYear.budget) * 100
                  : 0

                return (
                  <tr key={year} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(yearData.budget)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(yearData.status)}`}>
                        {getStatusIcon(yearData.status)}
                        <span>
                          {yearData.status === 'integrated' ? 'Integrado' : 
                           yearData.status === 'projected' ? 'Proyectado' : 'Disponible'}
                        </span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {index === years.length - 1 ? (
                        <span className="text-gray-500">-</span>
                      ) : (
                        <span className={variation >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {variation >= 0 ? '+' : ''}{variation.toFixed(1)}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <button
                        onClick={() => setSelectedYear(selectedYear === year ? null : year)}
                        className="text-primary-600 hover:text-primary-800 flex items-center space-x-1"
                      >
                        <span>DIPRES</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Year Details */}
      {selectedYear && sources.officialSources[selectedYear] && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">
              Fuentes Detalladas - Año {selectedYear}
            </h3>
          </div>

          <div className="space-y-4">
            {sources.officialSources[selectedYear].map((source, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(source.status)}`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(source.status)}
                  <div>
                    <div className="font-medium text-sm">{source.name}</div>
                    <div className="text-xs opacity-75">{source.description}</div>
                    {source.data && (
                      <div className="text-xs mt-1 opacity-90">
                        Presupuesto: {formatCurrency(source.data.totalBudget)}
                      </div>
                    )}
                  </div>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-xs hover:underline"
                  title="Ver fuente original"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Ver Fuente</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              Sobre las Fuentes de Datos
            </h3>
            <p className="text-sm text-gray-700 mt-1">
              Todos los datos presupuestarios provienen de fuentes oficiales del Gobierno de Chile, 
              principalmente DIPRES (Dirección de Presupuestos), BCN (Biblioteca del Congreso Nacional) 
              y análisis académicos de instituciones reconocidas como la Universidad San Sebastián.
            </p>
            <p className="text-sm text-gray-700 mt-2">
              La aplicación se actualiza periódicamente para integrar nuevas fuentes oficiales y 
              mejorar la precisión de los datos históricos.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataSources
