import { useState, useEffect } from 'react'
import { ExternalLink, CheckCircle, AlertTriangle, Clock, Info } from 'lucide-react'
import { budgetApi } from '../../services/api'

const DataSourceIndicator = ({ year, showDetails = false, className = '' }) => {
  const [sources, setSources] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (showDetails || showModal) {
      setLoading(true)
      budgetApi.getDataSources(year)
        .then(response => {
          setSources(response.data.data)
        })
        .catch(error => {
          console.error('Error fetching data sources:', error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [year, showDetails, showModal])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'integrated':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'available':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertTriangle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'integrated':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'available':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

  if (!showDetails && !showModal) {
    return (
      <button
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center space-x-1 text-sm text-gray-600 hover:text-primary-600 ${className}`}
        title="Ver fuentes de datos"
      >
        <Info className="w-4 h-4" />
        <span>Fuentes de datos</span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>
    )
  }

  if (!sources) {
    return (
      <div className="text-sm text-red-600">
        Error cargando fuentes de datos
      </div>
    )
  }

  const yearSources = sources.officialSources[year] || []
  const validation = sources.validation

  return (
    <>
      {showDetails && (
        <div className={`space-y-4 ${className}`}>
          {/* Status Overview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900">
                  Estado de las Fuentes de Datos {year ? `- ${year}` : ''}
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  {sources.currentStatus.note}
                </p>
                {validation && (
                  <div className="mt-2 space-y-1">
                    {validation.recommendations.map((rec, index) => (
                      <p key={index} className="text-xs text-blue-600">• {rec}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sources List */}
          {yearSources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-900">
                Fuentes Oficiales Disponibles:
              </h4>
              {yearSources.map((source, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(source.status)}`}
                >
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(source.status)}
                    <div>
                      <div className="font-medium text-sm">{source.name}</div>
                      <div className="text-xs opacity-75">{source.description}</div>
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
                    <span>Ver</span>
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Integration Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-green-800 font-medium">Integradas</div>
              <div className="text-green-600 text-xs mt-1">
                {sources.currentStatus.integratedSources.join(', ')}
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-yellow-800 font-medium">Pendientes</div>
              <div className="text-yellow-600 text-xs mt-1">
                {sources.currentStatus.pendingIntegration.join(', ')}
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-gray-800 font-medium">Estado Actual</div>
              <div className="text-gray-600 text-xs mt-1">
                {sources.currentStatus.usingMockData ? 'Datos simulados' : 'Datos oficiales'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Fuentes de Datos Presupuestarios
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <DataSourceIndicator year={year} showDetails={true} />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default DataSourceIndicator