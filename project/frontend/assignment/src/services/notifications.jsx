import api from './api'

export const notificationsService = {
  // Get user notifications
  getNotifications: async (params = {}) => {
    const response = await api.get('/notifications', { params })
    return response.data
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count')
    return response.data
  },

  // Mark notification as read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`)
    return response.data
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all')
    return response.data
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`)
    return response.data
  },

  // Get notifications by candidate
  getCandidateNotifications: async (candidateId, params = {}) => {
    const response = await api.get(`/notifications/by-candidate/${candidateId}`, { params })
    return response.data
  },

  // Get notification statistics
  getNotificationStats: async () => {
    const response = await api.get('/notifications/stats')
    return response.data
  },

  // Format notification message
  formatNotificationMessage: (notification) => {
    const { type, data, sender } = notification
    
    switch (type) {
      case 'mention':
        return `${sender.name} mentioned you in a note`
      case 'note_created':
        return `${sender.name} added a new note`
      case 'note_updated':
        return `${sender.name} updated a note`
      case 'candidate_assigned':
        return `You were assigned to ${data.candidateName}`
      case 'candidate_updated':
        return `${sender.name} updated ${data.candidateName}`
      case 'reaction_added':
        return `${sender.name} reacted to your note`
      default:
        return notification.message || 'New notification'
    }
  },

  // Get notification icon
  getNotificationIcon: (type) => {
    switch (type) {
      case 'mention':
        return '💬'
      case 'note_created':
        return '📝'
      case 'note_updated':
        return '✏️'
      case 'candidate_assigned':
        return '👤'
      case 'candidate_updated':
        return '🔄'
      case 'reaction_added':
        return '👍'
      default:
        return '🔔'
    }
  }
}
