import { VALIDATION } from './constants'

// Validation helpers
export const validateEmail = (email) => {
  if (!email) return false
  return VALIDATION.EMAIL_REGEX.test(email)
}

export const validatePassword = (password) => {
  if (!password) return false
  return password.length >= VALIDATION.PASSWORD_MIN_LENGTH
}

export const validateName = (name) => {
  if (!name) return false
  return name.length >= VALIDATION.NAME_MIN_LENGTH && name.length <= VALIDATION.NAME_MAX_LENGTH
}

export const validatePhone = (phone) => {
  if (!phone) return true // Phone is optional
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

export const validateUrl = (url) => {
  if (!url) return true // URL is optional
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Array helpers
export const uniqueArray = (array) => {
  return [...new Set(array)]
}

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export const filterBy = (array, filters) => {
  return array.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') return true
      
      const itemValue = item[key]
      if (typeof value === 'string') {
        return itemValue?.toString().toLowerCase().includes(value.toLowerCase())
      }
      
      return itemValue === value
    })
  })
}

export const paginate = (array, page = 1, limit = 10) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: array.length,
      totalPages: Math.ceil(array.length / limit),
      hasNext: endIndex < array.length,
      hasPrev: page > 1
    }
  }
}

// Object helpers
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

export const pick = (obj, keys) => {
  const result = {}
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key]
    }
  })
  return result
}

export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => {
    delete result[key]
  })
  return result
}

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

// String helpers
export const slugify = (text) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const generateId = (prefix = '') => {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substr(2, 5)
  return `${prefix}${timestamp}${randomStr}`
}

export const extractMentions = (text) => {
  if (!text) return []
  const mentionRegex = /@(\w+)/g
  const mentions = []
  let match
  
  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push(match[1])
  }
  
  return uniqueArray(mentions)
}

// Local storage helpers
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Error writing to localStorage:', error)
    return false
  }
}

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    return false
  }
}

// URL helpers
export const getQueryParams = (url = window.location.href) => {
  const params = new URLSearchParams(new URL(url).search)
  const result = {}
  
  for (const [key, value] of params) {
    result[key] = value
  }
  
  return result
}

export const setQueryParams = (params, url = window.location.href) => {
  const urlObj = new URL(url)
  const searchParams = new URLSearchParams(urlObj.search)
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      searchParams.delete(key)
    } else {
      searchParams.set(key, value)
    }
  })
  
  urlObj.search = searchParams.toString()
  return urlObj.toString()
}

// Debounce helper
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle helper
export const throttle = (func, limit) => {
  let inThrottle
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Error handling helpers
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error
  if (error?.response?.data?.message) return error.response.data.message
  if (error?.message) return error.message
  return 'An unexpected error occurred'
}

export const isNetworkError = (error) => {
  return !error.response && error.request
}

export const isServerError = (error) => {
  return error.response?.status >= 500
}

export const isClientError = (error) => {
  return error.response?.status >= 400 && error.response?.status < 500
}

// File helpers
export const getFileExtension = (filename) => {
  if (!filename) return ''
  return filename.split('.').pop().toLowerCase()
}

export const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
  return imageExtensions.includes(getFileExtension(filename))
}

export const isPdfFile = (filename) => {
  return getFileExtension(filename) === 'pdf'
}

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Color helpers
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

export const rgbToHex = (r, g, b) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export const getContrastColor = (hexColor) => {
  const rgb = hexToRgb(hexColor)
  if (!rgb) return '#000000'
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

// Export all helpers
export default {
  // Validation
  validateEmail,
  validatePassword,
  validateName,
  validatePhone,
  validateUrl,
  
  // Array
  uniqueArray,
  groupBy,
  sortBy,
  filterBy,
  paginate,
  
  // Object
  deepClone,
  pick,
  omit,
  isEmpty,
  
  // String
  slugify,
  generateId,
  extractMentions,
  
  // Storage
  getFromStorage,
  setToStorage,
  removeFromStorage,
  
  // URL
  getQueryParams,
  setQueryParams,
  
  // Performance
  debounce,
  throttle,
  
  // Error handling
  getErrorMessage,
  isNetworkError,
  isServerError,
  isClientError,
  
  // File
  getFileExtension,
  isImageFile,
  isPdfFile,
  formatFileSize,
  
  // Color
  hexToRgb,
  rgbToHex,
  getContrastColor
}
