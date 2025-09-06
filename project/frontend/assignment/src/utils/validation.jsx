import { useState } from 'react'
import { VALIDATION } from './constants'

// Validation rules
export const validationRules = {
  // Email validation
  email: {
    required: (value) => !value ? 'Email is required' : null,
    format: (value) => !VALIDATION.EMAIL_REGEX.test(value) ? 'Invalid email format' : null
  },

  // Password validation
  password: {
    required: (value) => !value ? 'Password is required' : null,
    minLength: (value) => value && value.length < VALIDATION.PASSWORD_MIN_LENGTH 
      ? `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters` : null
  },

  // Name validation
  name: {
    required: (value) => !value ? 'Name is required' : null,
    minLength: (value) => value && value.length < VALIDATION.NAME_MIN_LENGTH 
      ? `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters` : null,
    maxLength: (value) => value && value.length > VALIDATION.NAME_MAX_LENGTH 
      ? `Name must be no more than ${VALIDATION.NAME_MAX_LENGTH} characters` : null
  },

  // Phone validation
  phone: {
    format: (value) => {
      if (!value) return null // Phone is optional
      const cleaned = value.replace(/\D/g, '')
      if (cleaned.length < 10 || cleaned.length > 15) {
        return 'Phone number must be between 10 and 15 digits'
      }
      return null
    }
  },

  // URL validation
  url: {
    format: (value) => {
      if (!value) return null // URL is optional
      try {
        new URL(value)
        return null
      } catch {
        return 'Invalid URL format'
      }
    }
  },

  // Content validation
  content: {
    required: (value) => !value ? 'Content is required' : null,
    maxLength: (value) => value && value.length > VALIDATION.CONTENT_MAX_LENGTH 
      ? `Content must be no more than ${VALIDATION.CONTENT_MAX_LENGTH} characters` : null
  },

  // Role validation
  role: {
    required: (value) => !value ? 'Role is required' : null,
    valid: (value) => {
      const validRoles = ['admin', 'recruiter', 'hiring_manager']
      return !validRoles.includes(value) ? 'Invalid role selected' : null
    }
  },

  // Status validation
  status: {
    required: (value) => !value ? 'Status is required' : null,
    valid: (value) => {
      const validStatuses = ['new', 'screening', 'interview', 'offer', 'hired', 'rejected', 'withdrawn']
      return !validStatuses.includes(value) ? 'Invalid status selected' : null
    }
  },

  // Priority validation
  priority: {
    required: (value) => !value ? 'Priority is required' : null,
    valid: (value) => {
      const validPriorities = ['low', 'medium', 'high', 'urgent']
      return !validPriorities.includes(value) ? 'Invalid priority selected' : null
    }
  },

  // Note type validation
  noteType: {
    required: (value) => !value ? 'Note type is required' : null,
    valid: (value) => {
      const validTypes = ['note', 'feedback', 'interview_note', 'decision']
      return !validTypes.includes(value) ? 'Invalid note type selected' : null
    }
  },

  // Experience validation
  experience: {
    min: (value) => value && value < 0 ? 'Experience cannot be negative' : null,
    max: (value) => value && value > 50 ? 'Experience cannot exceed 50 years' : null
  },

  // Salary validation
  salary: {
    min: (value) => value && value < 0 ? 'Salary cannot be negative' : null
  }
}

// Validation functions
export const validateField = (value, rules) => {
  if (!rules) return null

  for (const rule of rules) {
    const error = rule(value)
    if (error) return error
  }

  return null
}

export const validateForm = (data, schema) => {
  const errors = {}

  Object.entries(schema).forEach(([field, rules]) => {
    const error = validateField(data[field], rules)
    if (error) {
      errors[field] = error
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Common validation schemas
export const validationSchemas = {
  // User registration
  register: {
    name: [validationRules.name.required, validationRules.name.minLength, validationRules.name.maxLength],
    email: [validationRules.email.required, validationRules.email.format],
    password: [validationRules.password.required, validationRules.password.minLength],
    role: [validationRules.role.required, validationRules.role.valid]
  },

  // User login
  login: {
    email: [validationRules.email.required, validationRules.email.format],
    password: [validationRules.password.required]
  },

  // Profile update
  profile: {
    name: [validationRules.name.required, validationRules.name.minLength, validationRules.name.maxLength],
    email: [validationRules.email.required, validationRules.email.format],
    phone: [validationRules.phone.format],
    linkedinUrl: [validationRules.url.format],
    githubUrl: [validationRules.url.format]
  },

  // Password change
  changePassword: {
    currentPassword: [validationRules.password.required],
    newPassword: [validationRules.password.required, validationRules.password.minLength],
    confirmPassword: [validationRules.password.required]
  },

  // Candidate creation
  candidate: {
    name: [validationRules.name.required, validationRules.name.minLength, validationRules.name.maxLength],
    email: [validationRules.email.required, validationRules.email.format],
    phone: [validationRules.phone.format],
    position: [validationRules.name.required, validationRules.name.minLength],
    experience: [validationRules.experience.min, validationRules.experience.max],
    salary: [validationRules.salary.min],
    linkedinUrl: [validationRules.url.format],
    githubUrl: [validationRules.url.format],
    status: [validationRules.status.required, validationRules.status.valid]
  },

  // Note creation
  note: {
    content: [validationRules.content.required, validationRules.content.maxLength],
    type: [validationRules.noteType.required, validationRules.noteType.valid],
    priority: [validationRules.priority.required, validationRules.priority.valid]
  },

  // User assignment
  assignment: {
    userIds: [(value) => !value || value.length === 0 ? 'At least one user must be selected' : null]
  }
}

// Custom validation functions
export const validatePasswordMatch = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return 'Passwords do not match'
  }
  return null
}

export const validateFileUpload = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles = 1
  } = options

  if (!file) return 'File is required'

  if (file.size > maxSize) {
    return `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`
  }

  if (!allowedTypes.includes(file.type)) {
    return `File type must be one of: ${allowedTypes.join(', ')}`
  }

  return null
}

export const validateMultipleFiles = (files, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024,
    allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
    maxFiles = 5
  } = options

  if (!files || files.length === 0) return 'At least one file is required'

  if (files.length > maxFiles) {
    return `Maximum ${maxFiles} files allowed`
  }

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const error = validateFileUpload(file, { maxSize, allowedTypes })
    if (error) {
      return `File ${i + 1}: ${error}`
    }
  }

  return null
}

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return null

  const start = new Date(startDate)
  const end = new Date(endDate)

  if (start > end) {
    return 'Start date must be before end date'
  }

  return null
}

export const validateAge = (birthDate, minAge = 18, maxAge = 100) => {
  if (!birthDate) return null

  const today = new Date()
  const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  if (age < minAge) {
    return `Age must be at least ${minAge} years`
  }

  if (age > maxAge) {
    return `Age cannot exceed ${maxAge} years`
  }

  return null
}

// Form validation hooks
export const useFormValidation = (initialData = {}, schema = {}) => {
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = (fieldName = null) => {
    if (fieldName) {
      // Validate single field
      const fieldSchema = schema[fieldName]
      if (fieldSchema) {
        const error = validateField(data[fieldName], fieldSchema)
        setErrors(prev => ({
          ...prev,
          [fieldName]: error
        }))
        return error
      }
    } else {
      // Validate entire form
      const validation = validateForm(data, schema)
      setErrors(validation.errors)
      return validation.isValid
    }
  }

  const handleChange = (fieldName, value) => {
    setData(prev => ({
      ...prev,
      [fieldName]: value
    }))

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }))
    }
  }

  const handleBlur = (fieldName) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }))
    validate(fieldName)
  }

  const reset = () => {
    setData(initialData)
    setErrors({})
    setTouched({})
  }

  return {
    data,
    errors,
    touched,
    isValid: Object.keys(errors).length === 0,
    validate,
    handleChange,
    handleBlur,
    reset,
    setData
  }
}

// Export all validation utilities
export default {
  validationRules,
  validateField,
  validateForm,
  validationSchemas,
  validatePasswordMatch,
  validateFileUpload,
  validateMultipleFiles,
  validateDateRange,
  validateAge,
  useFormValidation
}
