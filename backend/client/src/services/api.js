import axios from 'axios'

// En producción, la API está en el mismo servidor (ruta relativa)
// En desarrollo, usar el puerto del backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3001')

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making API request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Datos no encontrados')
    } else if (error.response?.status === 500) {
      throw new Error('Error interno del servidor')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Tiempo de espera agotado')
    } else if (!error.response) {
      throw new Error('Error de conexión')
    }
    
    throw error
  }
)

// API methods
export const budgetApi = {
  getBudget: (year = 2024) => api.get(`/budget?year=${year}`),
  getMinistries: (year = 2024, sort = 'budget', order = 'desc') => 
    api.get(`/budget/ministries?year=${year}&sort=${sort}&order=${order}`),
  getExpenses: (year = 2024) => api.get(`/budget/expenses?year=${year}`),
  getAgricultureDetails: (year = 2024) => api.get(`/budget/agriculture-details?year=${year}`),
  getDataSources: (year = null) => api.get(`/budget/data-sources${year ? `?year=${year}` : ''}`),
}

export const economicApi = {
  getEconomicData: (year = 2024) => api.get(`/economic?year=${year}`),
  getGDP: (year = 2024, range = 5) => api.get(`/economic/gdp?year=${year}&range=${range}`),
}

export const ministryApi = {
  getMinistry: (code, year = 2024) => api.get(`/ministry/${code}?year=${year}`),
  getAllMinistries: (year = 2024) => api.get(`/ministry?year=${year}`),
}

export default api

