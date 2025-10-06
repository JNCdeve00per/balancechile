import { useState, useEffect } from 'react'
import { ExternalLink, Database, TrendingUp, Calendar, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { budgetApi } from '../services/api'
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingStates'
import { formatCurrency, formatPercentage } from '../utils/formatters'

const BcnData = () => {
  const [bcnData, setBcnData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedYear, setSelectedYear] = useState(2024)
  const [availableYears, setAvailableYears] = useState([])
  const [bcnAvailability, setBcnAvailability] = useState(null)

  useEffect(() => {
    // Cargar años disponibles
    budgetApi.getBcnYears()
      .then(response => {
        setAvailableYears(response.data.data.years)
      })
      .catch(err => {
        console.error('Error loading BCN years:', err)
      })

    // Verificar disponibilidad de BCN
    budgetApi.getBcnAvailability()
      .then(response => {
        setBcnAvailability(response.data.data)
      })
      .catch(err => {
        console.error('Error checking BCN availability:', err)
      })
  }, [])

  useEffect(() => {
    if (selectedYear) {
      loadBcnData(selectedYear)
    }
  }, [selectedYear])

  const loadBcnData = async (year) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await budgetApi.getBcnData(year)
      setBcnData(response.data.data)
    } catch (err) {
      setError(err)
      console.error('Error loading BCN data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && !bcnData) {
    return <LoadingSpinner text="Cargando datos de BCN..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Datos BCN - Biblioteca del Congreso Nacional
            </h1>
            <p className="text-gray-600">
              Información oficial del presupuesto público de Chile
            </p>
          </div>
          <Database className="w-12 h-12 text-blue-600" />
        </div>

        {/* BCN Availability Status */}
        {bcnAvailability && (
          <div className={`flex items-center gap-2 p-3 rounded-lg ${
            bcnAvailability.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {bcnAvailability.available ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Servicio BCN disponible</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5" />
                <span>Servicio BCN no disponible: {bcnAvailability.message}</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Year Selector */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4">
          <Calendar className="w-6 h-6 text-blue-600" />
          <label htmlFor="year-select" className="text-lg font-semibold text-gray-900">
            Seleccionar Año:
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          {loading && <LoadingSpinner size="small" />}
        </div>
      </div>

      {error && (
        <ErrorMessage error={error} />
      )}

      {bcnData && (
        <>
          {/* Data Source Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Database className="w-6 h-6 text-blue-600 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Fuente de Datos
                </h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p><strong>Fuente:</strong> {bcnData.source}</p>
                  <p><strong>Año:</strong> {bcnData.year}</p>
                  <p><strong>Última actualización:</strong> {new Date(bcnData.lastUpdated).toLocaleString('es-CL')}</p>
                  <p>
                    <strong>Datos reales:</strong>{' '}
                    {bcnData.isRealData ? (
                      <span className="text-green-700 font-semibold">✓ Sí</span>
                    ) : (
                      <span className="text-red-700 font-semibold">✗ No disponibles</span>
                    )}
                  </p>
                  {bcnData.isFallback && (
                    <p className="text-red-700 font-semibold">
                      ⚠️ {bcnData.note}
                    </p>
                  )}
                  <a
                    href={bcnData.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Ver en BCN <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Totals Summary */}
          {bcnData.totales && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Presupuesto Aprobado</h3>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(bcnData.totales.aprobado)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Modificaciones</h3>
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(bcnData.totales.modificaciones)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Presupuesto Vigente</h3>
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(bcnData.totales.vigente)}
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-600">Devengado</h3>
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(bcnData.totales.devengado)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {formatPercentage(bcnData.totales.porcentajeEjecucion)} ejecutado
                </p>
              </div>
            </div>
          )}

          {/* Partidas Table */}
          {bcnData.partidas && bcnData.partidas.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalle de Partidas Presupuestarias
                  </h2>
                  <span className="text-sm text-gray-600">
                    {bcnData.partidasCount} partidas
                  </span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Institución
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aprobado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modificaciones
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vigente
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Devengado
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Ejecución
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bcnData.partidas.map((partida, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {partida.numero}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {partida.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(partida.aprobado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(partida.modificaciones)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                          {formatCurrency(partida.vigente)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(partida.devengado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={`font-medium ${
                            partida.porcentajeEjecucion >= 80 ? 'text-green-600' :
                            partida.porcentajeEjecucion >= 50 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {formatPercentage(partida.porcentajeEjecucion)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900">
                    No hay datos de partidas disponibles
                  </h3>
                  <p className="text-sm text-yellow-800 mt-1">
                    Los datos para el año {selectedYear} no están disponibles en BCN o no se pudieron cargar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BcnData
