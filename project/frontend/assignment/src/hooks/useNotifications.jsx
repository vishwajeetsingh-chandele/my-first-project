import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const useNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const { token } = useAuth()

  const fetchNotifications = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // This would be replaced with actual API call
      // const response = await notificationsAPI.getNotifications()
      // setNotifications(response.data)
      
      // Mock data for now
      const mockNotifications = [
        {
          id: '1',
          title: 'New Note Added',
          message: 'John Doe added a new note to candidate Jane Smith',
          type: 'new_note',
          isRead: false,
          createdAt: new Date().toISOString(),
          metadata: {
            candidateName: 'Jane Smith',
            authorName: 'John Doe'
          }
        }
      ]
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      // This would be replaced with actual API call
      // await notificationsAPI.markAsRead(notificationId)
      
      // Mock implementation
      setNotifications(prev => prev.map(n => 
        n.id === notificationId 
          ? { ...n, isRead: true }
          : n
      ))
      setUnreadCount(prev => Math.max(0, prev - 1))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const markAllAsRead = async () => {
    try {
      // This would be replaced with actual API call
      // await notificationsAPI.markAllAsRead()
      
      // Mock implementation
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const deleteNotification = async (notificationId) => {
    try {
      // This would be replaced with actual API call
      // await notificationsAPI.deleteNotification(notificationId)
      
      // Mock implementation
      const notification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const deleteAllNotifications = async () => {
    try {
      // This would be replaced with actual API call
      // await notificationsAPI.deleteAllNotifications()
      
      // Mock implementation
      setNotifications([])
      setUnreadCount(0)
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    }
  }

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev])
    if (!notification.isRead) {
      setUnreadCount(prev => prev + 1)
    }
  }

  useEffect(() => {
    if (token) {
      fetchNotifications()
    }
  }, [token])

  return {
    notifications,
    isLoading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    addNotification
  }
}

export default useNotifications
