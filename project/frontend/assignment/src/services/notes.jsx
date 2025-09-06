import api from './api'

export const notesService = {
  // Get notes for a candidate
  getNotesByCandidate: async (candidateId, params = {}) => {
    const response = await api.get(`/notes/candidate/${candidateId}`, { params })
    return response.data
  },

  // Get single note by ID
  getNote: async (noteId) => {
    const response = await api.get(`/notes/${noteId}`)
    return response.data
  },

  // Create note with mentions
  createNote: async (candidateId, noteData) => {
    const response = await api.post(`/notes/candidate/${candidateId}`, noteData)
    return response.data
  },

  // Update note
  updateNote: async (noteId, noteData) => {
    const response = await api.put(`/notes/${noteId}`, noteData)
    return response.data
  },

  // Delete note
  deleteNote: async (noteId) => {
    const response = await api.delete(`/notes/${noteId}`)
    return response.data
  },

  // Add/update reaction
  addReaction: async (noteId, reactionType) => {
    const response = await api.post(`/notes/${noteId}/reaction`, { type: reactionType })
    return response.data
  },

  // Remove reaction
  removeReaction: async (noteId) => {
    const response = await api.delete(`/notes/${noteId}/reaction`)
    return response.data
  },

  // Search notes
  searchNotes: async (query, filters = {}) => {
    const params = { q: query, ...filters }
    const response = await api.get('/notes/search', { params })
    return response.data
  },

  // Extract mentions from content
  extractMentions: (content) => {
    const mentionRegex = /@(\w+)/g
    const mentions = []
    let match
    
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1])
    }
    
    return [...new Set(mentions)] // Remove duplicates
  },

  // Format content with mention highlighting
  formatContentWithMentions: (content) => {
    return content.replace(/@(\w+)/g, '<span class="mention">@$1</span>')
  }
}
