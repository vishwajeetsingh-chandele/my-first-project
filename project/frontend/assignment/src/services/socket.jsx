import { io } from 'socket.io-client'
import toast from 'react-hot-toast'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 3 // Reduced from 5
    this.reconnectDelay = 2000 // Increased from 1000
    this.isReconnecting = false
  }

  // Initialize socket connection
  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket
    }

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
    
    this.socket = io(socketUrl, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    })

    this.setupEventListeners()
    return this.socket
  }

  // Setup socket event listeners
  setupEventListeners() {
    if (!this.socket) return

    // Connection events
    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id)
      this.isConnected = true
      this.reconnectAttempts = 0
      toast.success('Connected to real-time updates')
    })

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      this.isConnected = false
      
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      this.isConnected = false
      
      if (error.message === 'Authentication failed') {
        toast.error('Authentication failed. Please login again.')
        this.disconnect()
        window.location.href = '/login'
      } else {
        this.handleReconnect()
      }
    })

    // Real-time events
    this.socket.on('newNote', (data) => {
      console.log('New note received:', data)
      // Emit custom event for components to listen
      window.dispatchEvent(new CustomEvent('socket:newNote', { detail: data }))
    })

    this.socket.on('noteUpdated', (data) => {
      console.log('Note updated:', data)
      window.dispatchEvent(new CustomEvent('socket:noteUpdated', { detail: data }))
    })

    this.socket.on('noteDeleted', (data) => {
      console.log('Note deleted:', data)
      window.dispatchEvent(new CustomEvent('socket:noteDeleted', { detail: data }))
    })

    this.socket.on('userJoinedRoom', (data) => {
      console.log('User joined room:', data)
      window.dispatchEvent(new CustomEvent('socket:userJoinedRoom', { detail: data }))
    })

    this.socket.on('userLeftRoom', (data) => {
      console.log('User left room:', data)
      window.dispatchEvent(new CustomEvent('socket:userLeftRoom', { detail: data }))
    })

    this.socket.on('userTyping', (data) => {
      window.dispatchEvent(new CustomEvent('socket:userTyping', { detail: data }))
    })

    this.socket.on('userPresenceUpdate', (data) => {
      window.dispatchEvent(new CustomEvent('socket:userPresenceUpdate', { detail: data }))
    })

    this.socket.on('notification', (data) => {
      console.log('New notification:', data)
      toast.success(data.message || 'New notification received')
      window.dispatchEvent(new CustomEvent('socket:notification', { detail: data }))
    })

    this.socket.on('unreadCountUpdate', (data) => {
      window.dispatchEvent(new CustomEvent('socket:unreadCountUpdate', { detail: data }))
    })

    this.socket.on('onlineUsers', (data) => {
      window.dispatchEvent(new CustomEvent('socket:onlineUsers', { detail: data }))
    })
  }

  // Handle reconnection logic
  handleReconnect() {
    if (this.isReconnecting || this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        toast.error('Unable to connect to server. Please refresh the page.')
      }
      return
    }

    this.isReconnecting = true
    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
    
    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.socket?.connect()
      this.isReconnecting = false
    }, delay)
  }

  // Join candidate room
  joinCandidateRoom(candidateId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('joinCandidateRoom', { candidateId })
    }
  }

  // Leave candidate room
  leaveCandidateRoom(candidateId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leaveCandidateRoom', { candidateId })
    }
  }

  // Create note in real-time
  createNote(candidateId, noteData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('createNote', { candidateId, ...noteData })
    }
  }

  // Update note in real-time
  updateNote(noteId, noteData) {
    if (this.socket && this.isConnected) {
      this.socket.emit('updateNote', { noteId, ...noteData })
    }
  }

  // Delete note in real-time
  deleteNote(noteId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('deleteNote', { noteId })
    }
  }

  // Send typing indicator
  sendTyping(candidateId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { candidateId, isTyping })
    }
  }

  // Update presence status
  updatePresence(status) {
    if (this.socket && this.isConnected) {
      this.socket.emit('updatePresence', { status })
    }
  }

  // Get online users
  getOnlineUsers(candidateId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('getOnlineUsers', { candidateId })
    }
  }

  // Mark notification as read
  markNotificationRead(notificationId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('markNotificationRead', { notificationId })
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts
    }
  }
}

// Create singleton instance
const socketService = new SocketService()

export default socketService
