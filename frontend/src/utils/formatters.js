// Format numbers with Chilean locale
export const formatCurrency = (amount, currency = 'CLP') => {
  if (amount === null || amount === undefined) return 'N/A'
  
  const formatters = {
    CLP: new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }),
    USD: new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }
  
  return formatters[currency]?.format(amount) || amount.toLocaleString('es-CL')
}

// Format large numbers with abbreviations
export const formatLargeNumber = (num) => {
  if (num === null || num === undefined) return 'N/A'
  
  const absNum = Math.abs(num)
  
  if (absNum >= 1e12) {
    return (num / 1e12).toFixed(1) + 'B' // Billones
  } else if (absNum >= 1e9) {
    return (num / 1e9).toFixed(1) + 'MM' // Miles de millones
  } else if (absNum >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M' // Millones
  } else if (absNum >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K' // Miles
  }
  
  return num.toString()
}

// Format percentage
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return 'N/A'
  return `${value.toFixed(decimals)}%`
}

// Format date
export const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Generate colors for charts
export const generateColors = (count) => {
  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ]
  
  if (count <= colors.length) {
    return colors.slice(0, count)
  }
  
  // Generate additional colors if needed
  const additionalColors = []
  for (let i = colors.length; i < count; i++) {
    const hue = (i * 137.508) % 360 // Golden angle approximation
    additionalColors.push(`hsl(${hue}, 70%, 50%)`)
  }
  
  return [...colors, ...additionalColors]
}

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Get ministry color based on name
export const getMinistryColor = (ministryName) => {
  const colors = {
    'Educación': '#3b82f6',
    'Salud': '#ef4444',
    'Interior': '#10b981',
    'Defensa': '#f59e0b',
    'Obras Públicas': '#8b5cf6',
    'Desarrollo Social': '#06b6d4',
    'Justicia': '#84cc16',
    'Hacienda': '#f97316',
    'Trabajo': '#ec4899',
  }
  
  // Find matching ministry by checking if the name contains the key
  for (const [key, color] of Object.entries(colors)) {
    if (ministryName.toLowerCase().includes(key.toLowerCase())) {
      return color
    }
  }
  
  // Default color if no match found
  return '#6366f1'
}

