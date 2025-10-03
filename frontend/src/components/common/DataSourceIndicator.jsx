import { useState, useEffect } from 'react'
import { RefreshCw, Database, AlertCircle } from 'lucide-react'

const DataSourceIndicator = ({ year, source, isRealData, lastUpdated }) => {
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setIsUpdating(true)
    const timer = setTimeout(() => setIsUpdating(false), 1000)
    return () => clearTimeout(timer)
  }, [year, source])

  return (
    <div className="flex items-center space-x-2 text-sm">
      {isUpdating ? (
        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
      ) : (
        <Database className="w-4 h-4 text-green-600" />
      )}
      
      <div className="flex items-center space-x-1">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          isRealData 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {isRealData ? 'Datos Oficiales' : 'Datos Demo'}
        </span>
        
        {!isRealData && (
          <AlertCircle className="w-3 h-3 text-yellow-600" title="Datos de demostración" />
        )}
      </div>
      
      <span className="text-gray-500">
        {year} • {source}
      </span>
      
      {lastUpdated && (
        <span className="text-gray-400 text-xs">
          Actualizado: {new Date(lastUpdated).toLocaleTimeString('es-CL')}
        </span>
      )}
    </div>
  )
}

export default DataSourceIndicator

