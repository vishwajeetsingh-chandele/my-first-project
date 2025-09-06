import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { candidatesService } from '../services/candidates'

const useCandidates = () => {
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { token } = useAuth()

  const fetchCandidates = async (filters = {}) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await candidatesService.getCandidates(filters)
      setCandidates(response.candidates || response.data || [])
    } catch (err) {
      console.error('Error fetching candidates:', err)
      setError(err.response?.data?.error || err.message || 'Failed to fetch candidates')
    } finally {
      setIsLoading(false)
    }
  }

  const createCandidate = async (candidateData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await candidatesService.createCandidate(candidateData)
      setCandidates(prev => [...prev, response.candidate || response.data])
      return { success: true, data: response.candidate || response.data }
    } catch (err) {
      console.error('Error creating candidate:', err)
      setError(err.response?.data?.error || err.message || 'Failed to create candidate')
      return { success: false, error: err.response?.data?.error || err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const updateCandidate = async (id, candidateData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await candidatesService.updateCandidate(id, candidateData)
      setCandidates(prev => prev.map(c => 
        c.id === id ? response.candidate || response.data : c
      ))
      return { success: true }
    } catch (err) {
      console.error('Error updating candidate:', err)
      setError(err.response?.data?.error || err.message || 'Failed to update candidate')
      return { success: false, error: err.response?.data?.error || err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCandidate = async (id) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await candidatesService.deleteCandidate(id)
      setCandidates(prev => prev.filter(c => c.id !== id))
      return { success: true }
    } catch (err) {
      console.error('Error deleting candidate:', err)
      setError(err.response?.data?.error || err.message || 'Failed to delete candidate')
      return { success: false, error: err.response?.data?.error || err.message }
    } finally {
      setIsLoading(false)
    }
  }

  const assignUsers = async (candidateId, userIds) => {
    setIsLoading(true)
    setError(null)
    
    try {
      await candidatesService.assignUsers(candidateId, userIds)
      // Refresh candidates to get updated assignments
      await fetchCandidates()
      return { success: true }
    } catch (err) {
      console.error('Error assigning users:', err)
      setError(err.response?.data?.error || err.message || 'Failed to assign users')
      return { success: false, error: err.response?.data?.error || err.message }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchCandidates()
    }
  }, [token])

  const searchCandidates = async (searchTerm) => {
    await fetchCandidates({ search: searchTerm })
  }

  const filterByStatus = async (status) => {
    await fetchCandidates({ status })
  }

  const assignUsersToCandidate = async (candidateId, userIds) => {
    return await assignUsers(candidateId, userIds)
  }

  return {
    candidates,
    isLoading,
    error,
    searchCandidates,
    filterByStatus,
    createCandidate,
    updateCandidate,
    deleteCandidate,
    assignUsersToCandidate
  }
}

export default useCandidates
