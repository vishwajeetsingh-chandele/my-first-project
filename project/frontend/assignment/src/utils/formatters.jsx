import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'
import { DATE_FORMATS } from './constants'

// Date formatting functions
export const formatDate = (date, formatString = DATE_FORMATS.DISPLAY) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return ''
    
    return format(dateObj, formatString)
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}

export const formatDateWithTime = (date) => {
  return formatDate(date, DATE_FORMATS.DISPLAY_WITH_TIME)
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date
    if (!isValid(dateObj)) return ''
    
    return formatDistanceToNow(dateObj, { addSuffix: true })
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return ''
  }
}

export const formatTimeOnly = (date) => {
  return formatDate(date, DATE_FORMATS.TIME_ONLY)
}

// Text formatting functions
export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeWords = (str) => {
  if (!str) return ''
  return str.split(' ').map(word => capitalizeFirst(word)).join(' ')
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  
  return phone // Return original if not 10 digits
}

export const formatEmail = (email) => {
  if (!email) return ''
  return email.toLowerCase().trim()
}

// Number formatting functions
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined) return '0'
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%'
  return `${Number(value).toFixed(decimals)}%`
}

// File size formatting
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Status formatting
export const formatStatus = (status) => {
  if (!status) return ''
  return capitalizeWords(status.replace('_', ' '))
}

export const formatRole = (role) => {
  if (!role) return ''
  return capitalizeWords(role.replace('_', ' '))
}

export const formatPriority = (priority) => {
  if (!priority) return ''
  return capitalizeFirst(priority)
}

// Name formatting
export const formatFullName = (firstName, lastName) => {
  const first = firstName || ''
  const last = lastName || ''
  return `${first} ${last}`.trim()
}

export const formatInitials = (name) => {
  if (!name) return '?'
  
  const names = name.split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return name[0].toUpperCase()
}

// URL formatting
export const formatUrl = (url) => {
  if (!url) return ''
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`
  }
  
  return url
}

// Social media formatting
export const formatLinkedInUrl = (url) => {
  if (!url) return ''
  
  // Extract username from various LinkedIn URL formats
  const patterns = [
    /linkedin\.com\/in\/([^\/\?]+)/,
    /linkedin\.com\/pub\/([^\/\?]+)/,
    /linkedin\.com\/company\/([^\/\?]+)/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return `https://linkedin.com/in/${match[1]}`
    }
  }
  
  return formatUrl(url)
}

export const formatGitHubUrl = (url) => {
  if (!url) return ''
  
  // Extract username from GitHub URL
  const match = url.match(/github\.com\/([^\/\?]+)/)
  if (match) {
    return `https://github.com/${match[1]}`
  }
  
  return formatUrl(url)
}

// Content formatting
export const formatMentions = (content) => {
  if (!content) return ''
  
  // Replace @mentions with highlighted spans
  return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>')
}

export const stripHtml = (html) => {
  if (!html) return ''
  
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}

export const formatSearchQuery = (query) => {
  if (!query) return ''
  
  // Remove extra spaces and trim
  return query.replace(/\s+/g, ' ').trim()
}

// Validation formatting
export const formatValidationError = (errors) => {
  if (!errors) return ''
  
  if (typeof errors === 'string') {
    return errors
  }
  
  if (Array.isArray(errors)) {
    return errors.join(', ')
  }
  
  if (typeof errors === 'object') {
    return Object.values(errors).join(', ')
  }
  
  return 'Validation error'
}

// Export all formatters
export default {
  // Date formatters
  formatDate,
  formatDateWithTime,
  formatRelativeTime,
  formatTimeOnly,
  
  // Text formatters
  capitalizeFirst,
  capitalizeWords,
  truncateText,
  formatPhoneNumber,
  formatEmail,
  
  // Number formatters
  formatNumber,
  formatCurrency,
  formatPercentage,
  
  // File formatters
  formatFileSize,
  
  // Status formatters
  formatStatus,
  formatRole,
  formatPriority,
  
  // Name formatters
  formatFullName,
  formatInitials,
  
  // URL formatters
  formatUrl,
  formatLinkedInUrl,
  formatGitHubUrl,
  
  // Content formatters
  formatMentions,
  stripHtml,
  formatSearchQuery,
  
  // Validation formatters
  formatValidationError
}
