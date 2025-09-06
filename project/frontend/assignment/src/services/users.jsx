import api from './api'

export const usersService = {
  // Get all users (for autocomplete)
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params })
    return response.data
  },

  // Get user profile by ID
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  // Search users for mentions
  searchUsersForMentions: async (query) => {
    const response = await api.get('/users/search/mentions', { 
      params: { q: query } 
    })
    return response.data
  },

  // Update user (Admin only)
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  // Deactivate user (Admin only)
  deactivateUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  // Get user statistics (Admin only)
  getUserStats: async () => {
    const response = await api.get('/users/stats/overview')
    return response.data
  },

  // Get user's assigned candidates
  getUserCandidates: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/candidates`, { params })
    return response.data
  },

  // Get user's activity
  getUserActivity: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/activity`, { params })
    return response.data
  },

  // Format user name for display
  formatUserName: (user) => {
    if (!user) return ''
    return user.name || user.email || 'Unknown User'
  },

  // Get user initials for avatar
  getUserInitials: (user) => {
    if (!user || !user.name) return '?'
    
    const names = user.name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return user.name[0].toUpperCase()
  },

  // Check if user has role
  hasRole: (user, role) => {
    return user && user.role === role
  },

  // Check if user is admin
  isAdmin: (user) => {
    return user && user.role === 'admin'
  },

  // Check if user is recruiter
  isRecruiter: (user) => {
    return user && user.role === 'recruiter'
  },

  // Check if user is hiring manager
  isHiringManager: (user) => {
    return user && user.role === 'hiring_manager'
  }
}
