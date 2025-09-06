import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { notesService } from '../services/notes'

const useNotes = (candidateId) => {
  const [notes, setNotes] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const fetchNotes = async () => {
    if (!candidateId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await notesService.getNotesByCandidate(candidateId)
      setNotes(response.notes || response.data || [])
    } catch (err) {
      console.error('Error fetching notes:', err)
      setError(err.response?.data?.error || err.message || 'Failed to fetch notes')
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async (noteData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await notesService.createNote(candidateId, noteData)
      setNotes(prev => [...prev, response.note || response.data])
      return { success: true, data: response.note || response.data }
    } catch (err) {
      console.error('Error creating note:', err)
      setError(err.response?.data?.error || err.message || 'Failed to create note')
      return { success: false, error: err.response?.data?.error || err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const updateNote = async (noteId, noteData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await notesService.updateNote(noteId, noteData)
      setNotes(prev => prev.map(n => 
        n.id === noteId ? response.note || response.data : n
      ))
      return { success: true }
    } catch (err) {
      console.error('Error updating note:', err)
      setError(err.response?.data?.error || err.message || 'Failed to update note')
      return { success: false, error: err.response?.data?.error || err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteNote = async (noteId) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await notesService.deleteNote(noteId)
      setNotes(prev => prev.filter(n => n.id !== noteId))
      return { success: true }
    } catch (err) {
      console.error('Error deleting note:', err)
      setError(err.response?.data?.error || err.message || 'Failed to delete note')
      return { success: false, error: err.response?.data?.error || err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const addReaction = async (noteId, reactionType) => {
    try {
      await notesService.addReaction(noteId, reactionType)
      // Refresh notes to get updated reactions
      await fetchNotes()
      return { success: true }
    } catch (err) {
      console.error('Error adding reaction:', err)
      setError(err.response?.data?.error || err.message || 'Failed to add reaction')
      return { success: false, error: err.response?.data?.error || err.message }
    }
  }

  const removeReaction = async (noteId, reactionType) => {
    try {
      await notesService.removeReaction(noteId)
      // Refresh notes to get updated reactions
      await fetchNotes()
      return { success: true }
    } catch (err) {
      console.error('Error removing reaction:', err)
      setError(err.response?.data?.error || err.message || 'Failed to remove reaction')
      return { success: false, error: err.response?.data?.error || err.message }
    }
  }

  useEffect(() => {
    if (token && candidateId) {
      fetchNotes()
    }
  }, [token, candidateId])

  return {
    notes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    addReaction,
    removeReaction
  }
}

export default useNotes
