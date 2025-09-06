import { createContext, useContext, useReducer, useEffect } from 'react'
import { notificationsService } from '../services/notifications'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null
}

// Action types
const NOTIFICATION_ACTIONS = {
  FETCH_START: 'FETCH_START',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
  FETCH_FAILURE: 'FETCH_FAILURE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_READ: 'MARK_ALL_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT',
  CLEAR_ERROR: 'CLEAR_ERROR'
}

// Reducer function
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.FETCH_START:
      return {
        ...state,
        isLoading: true,
        error: null
      }
      
    case NOTIFICATION_ACTIONS.FETCH_SUCCESS:
      return {
        ...state,
        notifications: action.payload.notifications,
        unreadCount: action.payload.unreadCount || state.unreadCount,
        isLoading: false,
        error: null
      }
      
    case NOTIFICATION_ACTIONS.FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
      
    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      }
      
    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, isRead: true }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }
      
    case NOTIFICATION_ACTIONS.MARK_ALL_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          isRead: true
        })),
        unreadCount: 0
      }
      
    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }
      
    case NOTIFICATION_ACTIONS.UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload
      }
      
    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      }
      
    default:
      return state
  }
}

// Create context
const NotificationContext = createContext()

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [])

  // Listen for real-time notifications
  useEffect(() => {
    const handleNewNotification = (event) => {
      const { detail } = event
      dispatch({
        type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
        payload: detail
      })
    }

    const handleUnreadCountUpdate = (event) => {
      const { detail } = event
      dispatch({
        type: NOTIFICATION_ACTIONS.UPDATE_UNREAD_COUNT,
        payload: detail.count
      })
    }

    window.addEventListener('socket:notification', handleNewNotification)
    window.addEventListener('socket:unreadCountUpdate', handleUnreadCountUpdate)

    return () => {
      window.removeEventListener('socket:notification', handleNewNotification)
      window.removeEventListener('socket:unreadCountUpdate', handleUnreadCountUpdate)
    }
  }, [])

  // Fetch notifications
  const fetchNotifications = async (params = {}) => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.FETCH_START })
      
      const data = await notificationsService.getNotifications(params)
      
      dispatch({
        type: NOTIFICATION_ACTIONS.FETCH_SUCCESS,
        payload: data
      })
    } catch (error) {
      dispatch({
        type: NOTIFICATION_ACTIONS.FETCH_FAILURE,
        payload: error.message
      })
    }
  }

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const data = await notificationsService.getUnreadCount()
      dispatch({
        type: NOTIFICATION_ACTIONS.UPDATE_UNREAD_COUNT,
        payload: data.count
      })
    } catch (error) {
      console.error('Failed to fetch unread count:', error)
    }
  }

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await notificationsService.markAsRead(id)
      dispatch({
        type: NOTIFICATION_ACTIONS.MARK_AS_READ,
        payload: id
      })
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead()
      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_READ })
      toast.success('All notifications marked as read')
    } catch (error) {
      toast.error('Failed to mark all notifications as read')
    }
  }

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await notificationsService.deleteNotification(id)
      dispatch({
        type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION,
        payload: id
      })
      toast.success('Notification deleted')
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  // Get notifications by candidate
  const getCandidateNotifications = async (candidateId, params = {}) => {
    try {
      const data = await notificationsService.getCandidateNotifications(candidateId, params)
      return data
    } catch (error) {
      console.error('Failed to fetch candidate notifications:', error)
      return []
    }
  }

  // Get notification statistics
  const getNotificationStats = async () => {
    try {
      const data = await notificationsService.getNotificationStats()
      return data
    } catch (error) {
      console.error('Failed to fetch notification stats:', error)
      return null
    }
  }

  // Clear error
  const clearError = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR })
  }

  // Format notification message
  const formatNotificationMessage = (notification) => {
    return notificationsService.formatNotificationMessage(notification)
  }

  // Get notification icon
  const getNotificationIcon = (type) => {
    return notificationsService.getNotificationIcon(type)
  }

  const value = {
    // State
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getCandidateNotifications,
    getNotificationStats,
    clearError,
    
    // Utilities
    formatNotificationMessage,
    getNotificationIcon
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export default NotificationContext
