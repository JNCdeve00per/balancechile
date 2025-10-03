import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, ArrowUpDown, Building2, ExternalLink } from 'lucide-react'
import { useMinistries } from '../hooks/useApi'
import { LoadingSpinner, ErrorMessage } from '../components/common/LoadingStates'
import { formatCurrency, formatPercentage } from '../utils/formatters'

const Ministries = () => {
  const [selectedYear, setSelectedYear] = useState(2025)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState('budget')
  const [sortOrder, setSortOrder] = useState('desc')

  const { data: ministriesData, isLoading, error, refetch } = useMinistries(selectedYear, sortField, sortOrder)

  const years = [2025, 2024, 2023, 2022, 2021, 2020]

  if (isLoading) {
    return <LoadingSpinner text="Cargando ministerios..." />
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />
  }

  const ministries = ministriesData?.data?.ministries || []
  const totalBudget = ministriesData?.data?.totalBudget || 0

  // Filter ministries based on search term
  const filteredMinistries = ministries.filter(ministry =>
    ministry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ministry.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 text-gray-400" />
    return (
      <ArrowUpDown 
        className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''} text-primary-600`} 
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ministerios</h1>
          <p className="text-gray-600 mt-1">
            Distribución del presupuesto por ministerio - {selectedYear}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Building2 className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Ministerios</p>
              <p className="text-2xl font-bold text-gray-900">{ministries.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Presupuesto Total</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(totalBudget)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Filtrados</p>
              <p className="text-2xl font-bold text-gray-900">{filteredMinistries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar ministerio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          
          <div className="text-sm text-gray-600">
            Mostrando {filteredMinistries.length} de {ministries.length} ministerios
          </div>
        </div>
      </div>

      {/* Ministries Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Ministerio</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('budget')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Presupuesto</span>
                    {getSortIcon('budget')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('percentage')}
                >
                  <div className="flex items-center space-x-1">
                    <span>% del Total</span>
                    {getSortIcon('percentage')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMinistries.map((ministry) => (
                <tr key={ministry.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {ministry.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ministry.code}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(ministry.budget)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm text-gray-900 mr-2">
                        {formatPercentage(ministry.percentage)}
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${Math.min(ministry.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/ministry/${ministry.code}`}
                      className="text-primary-600 hover:text-primary-900 flex items-center space-x-1"
                    >
                      <span>Ver detalles</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMinistries.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron ministerios
            </h3>
            <p className="text-gray-600">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Ministries

