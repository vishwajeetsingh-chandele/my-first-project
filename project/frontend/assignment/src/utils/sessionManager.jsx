// Session management utilities
export const sessionManager = {
  // Clear all session data
  clearSession: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.clear()
  },

  // Check if session is valid
  isSessionValid: () => {
    const token = localStorage.getItem('token')
    if (!token) return false

    try {
      // Decode JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp > currentTime
    } catch (error) {
      console.error('Error checking session validity:', error)
      return false
    }
  },

  // Get session info
  getSessionInfo: () => {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) return null

    try {
      const userData = JSON.parse(user)
      return {
        token,
        user: userData,
        isValid: sessionManager.isSessionValid()
      }
    } catch (error) {
      console.error('Error parsing session info:', error)
      return null
    }
  },

  // Rate limiting for API calls
  rateLimiter: {
    attempts: new Map(),
    
    checkLimit: (key, maxAttempts = 5, windowMs = 60000) => {
      const now = Date.now()
      const userAttempts = sessionManager.rateLimiter.attempts.get(key) || []
      
      // Remove old attempts outside the window
      const validAttempts = userAttempts.filter(time => now - time < windowMs)
      
      if (validAttempts.length >= maxAttempts) {
        return false
      }
      
      // Add current attempt
      validAttempts.push(now)
      sessionManager.rateLimiter.attempts.set(key, validAttempts)
      
      return true
    },
    
    reset: (key) => {
      sessionManager.rateLimiter.attempts.delete(key)
    }
  }
}

export default sessionManager
