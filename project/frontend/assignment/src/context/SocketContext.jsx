import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import socketService from '../services/socket'

// Create context
const SocketContext = createContext()

// Socket provider component
export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [currentRoom, setCurrentRoom] = useState(null)

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      // Only connect if not already connected
      if (!socketService.getConnectionStatus().isConnected) {
        socketService.connect(token)
        setIsConnected(true)
      }
    } else {
      // Only disconnect if currently connected
      if (socketService.getConnectionStatus().isConnected) {
        socketService.disconnect()
        setIsConnected(false)
      }
    }

    return () => {
      // Only disconnect on unmount if we're not authenticated
      if (!isAuthenticated) {
        socketService.disconnect()
      }
    }
  }, [isAuthenticated, token])

  // Listen for socket events
  useEffect(() => {
    const handleNewNote = (event) => {
      const { detail } = event
      // Handle new note event
      console.log('New note received:', detail)
    }

    const handleNoteUpdated = (event) => {
      const { detail } = event
      console.log('Note updated:', detail)
    }

    const handleNoteDeleted = (event) => {
      const { detail } = event
      console.log('Note deleted:', detail)
    }

    const handleUserJoinedRoom = (event) => {
      const { detail } = event
      console.log('User joined room:', detail)
    }

    const handleUserLeftRoom = (event) => {
      const { detail } = event
      console.log('User left room:', detail)
    }

    const handleUserTyping = (event) => {
      const { detail } = event
      setTypingUsers(prev => {
        if (detail.isTyping) {
          return [...prev.filter(u => u.id !== detail.user.id), detail.user]
        } else {
          return prev.filter(u => u.id !== detail.user.id)
        }
      })
    }

    const handleUserPresenceUpdate = (event) => {
      const { detail } = event
      console.log('User presence updated:', detail)
    }

    const handleOnlineUsers = (event) => {
      const { detail } = event
      setOnlineUsers(detail.users || [])
    }

    // Add event listeners
    window.addEventListener('socket:newNote', handleNewNote)
    window.addEventListener('socket:noteUpdated', handleNoteUpdated)
    window.addEventListener('socket:noteDeleted', handleNoteDeleted)
    window.addEventListener('socket:userJoinedRoom', handleUserJoinedRoom)
    window.addEventListener('socket:userLeftRoom', handleUserLeftRoom)
    window.addEventListener('socket:userTyping', handleUserTyping)
    window.addEventListener('socket:userPresenceUpdate', handleUserPresenceUpdate)
    window.addEventListener('socket:onlineUsers', handleOnlineUsers)

    // Cleanup event listeners
    return () => {
      window.removeEventListener('socket:newNote', handleNewNote)
      window.removeEventListener('socket:noteUpdated', handleNoteUpdated)
      window.removeEventListener('socket:noteDeleted', handleNoteDeleted)
      window.removeEventListener('socket:userJoinedRoom', handleUserJoinedRoom)
      window.removeEventListener('socket:userLeftRoom', handleUserLeftRoom)
      window.removeEventListener('socket:userTyping', handleUserTyping)
      window.removeEventListener('socket:userPresenceUpdate', handleUserPresenceUpdate)
      window.removeEventListener('socket:onlineUsers', handleOnlineUsers)
    }
  }, [])

  // Socket methods
  const joinCandidateRoom = (candidateId) => {
    socketService.joinCandidateRoom(candidateId)
    setCurrentRoom(candidateId)
  }

  const leaveCandidateRoom = (candidateId) => {
    socketService.leaveCandidateRoom(candidateId)
    if (currentRoom === candidateId) {
      setCurrentRoom(null)
    }
  }

  const createNote = (candidateId, noteData) => {
    socketService.createNote(candidateId, noteData)
  }

  const updateNote = (noteId, noteData) => {
    socketService.updateNote(noteId, noteData)
  }

  const deleteNote = (noteId) => {
    socketService.deleteNote(noteId)
  }

  const sendTyping = (candidateId, isTyping) => {
    socketService.sendTyping(candidateId, isTyping)
  }

  const updatePresence = (status) => {
    socketService.updatePresence(status)
  }

  const getOnlineUsers = (candidateId) => {
    socketService.getOnlineUsers(candidateId)
  }

  const markNotificationRead = (notificationId) => {
    socketService.markNotificationRead(notificationId)
  }

  const getConnectionStatus = () => {
    return socketService.getConnectionStatus()
  }

  const value = {
    // State
    isConnected,
    onlineUsers,
    typingUsers,
    currentRoom,
    
    // Methods
    joinCandidateRoom,
    leaveCandidateRoom,
    createNote,
    updateNote,
    deleteNote,
    sendTyping,
    updatePresence,
    getOnlineUsers,
    markNotificationRead,
    getConnectionStatus
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

// Custom hook to use socket context
export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export default SocketContext
