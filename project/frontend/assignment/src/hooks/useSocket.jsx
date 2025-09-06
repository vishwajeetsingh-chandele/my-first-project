import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const { token } = useAuth()

  useEffect(() => {
    // Mock socket connection status
    setIsConnected(!!token)
    
    // Mock online users
    if (token) {
      setOnlineUsers([
        { id: '1', name: 'John Doe', role: 'recruiter' },
        { id: '2', name: 'Jane Smith', role: 'hiring_manager' }
      ])
    } else {
      setOnlineUsers([])
    }
  }, [token])

  const joinRoom = (roomId) => {
    // Mock implementation
    console.log(`Joining room: ${roomId}`)
  }

  const leaveRoom = (roomId) => {
    // Mock implementation
    console.log(`Leaving room: ${roomId}`)
  }

  const emitTyping = (candidateId, isTyping) => {
    // Mock implementation
    console.log(`Typing in candidate ${candidateId}: ${isTyping}`)
  }

  const emitNote = (noteData) => {
    // Mock implementation
    console.log('Emitting note:', noteData)
  }

  return {
    isConnected,
    onlineUsers,
    typingUsers,
    joinRoom,
    leaveRoom,
    emitTyping,
    emitNote
  }
}

export default useSocket
