import api from './api'

export const candidatesService = {
  // Get all candidates with pagination and filters
  getCandidates: async (params = {}) => {
    const response = await api.get('/candidates', { params })
    return response.data
  },

  // Get single candidate by ID
  getCandidate: async (id) => {
    const response = await api.get(`/candidates/${id}`)
    return response.data
  },

  // Create new candidate
  createCandidate: async (candidateData) => {
    const response = await api.post('/candidates', candidateData)
    return response.data
  },

  // Update candidate
  updateCandidate: async (id, candidateData) => {
    const response = await api.put(`/candidates/${id}`, candidateData)
    return response.data
  },

  // Soft delete candidate
  deleteCandidate: async (id) => {
    const response = await api.delete(`/candidates/${id}`)
    return response.data
  },

  // Assign users to candidate
  assignUsers: async (id, userIds) => {
    const response = await api.post(`/candidates/${id}/assign`, { userIds })
    return response.data
  },

  // Remove user assignment
  removeAssignment: async (id, userId) => {
    const response = await api.delete(`/candidates/${id}/assign/${userId}`)
    return response.data
  },

  // Get candidate statistics
  getCandidateStats: async (id) => {
    const response = await api.get(`/candidates/${id}/stats`)
    return response.data
  },

  // Search candidates
  searchCandidates: async (query, filters = {}) => {
    const params = { q: query, ...filters }
    const response = await api.get('/candidates', { params })
    return response.data
  }
}
