import api from './api'

export const authService = {
  // Register new user
  register: async (userData) => {
    console.log('userData', userData)
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    const { token, user } = response.data
    
    // Store token and user data
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    
    return { token, user }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/auth/profile', profileData)
    const updatedUser = response.data
    
    // Update stored user data
    localStorage.setItem('user', JSON.stringify(updatedUser))
    
    return updatedUser
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/change-password', passwordData)
    return response.data
  },

  // Refresh token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh')
    const { token } = response.data
    
    localStorage.setItem('token', token)
    return token
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error)
    } finally {
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token')
    return !!token
  },

  // Get stored user data
  getStoredUser: () => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Get stored token
  getStoredToken: () => {
    return localStorage.getItem('token')
  }
}
