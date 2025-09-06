import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import  useCandidates  from '../../hooks/useCandidates'
import CandidateList from '../../components/candidates/CandidateList'
import CandidateFilters from '../../components/candidates/CandidateFilters'

import { PlusIcon } from '@heroicons/react/24/outline'

const CandidatesPage = () => {
  const {
    candidates,
    isLoading,
    error,
    searchCandidates,
    filterByStatus,
    deleteCandidate,
    assignUsersToCandidate
  } = useCandidates()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    // Load candidates on component mount
    searchCandidates('')
  }, [])

  const handleSearch = (term) => {
    setSearchTerm(term)
    searchCandidates(term)
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    filterByStatus(status)
  }

  const handleDelete = async (candidateId) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      await deleteCandidate(candidateId)
    }
  }

  const handleAssignUsers = async (candidateId, userIds) => {
    await assignUsersToCandidate(candidateId, userIds)
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading candidates</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage and track your candidate pipeline.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link
            to="/candidates/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Candidate
          </Link>
        </div>
      </div>

      {/* Filters */}
      <CandidateFilters
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />

      {/* Candidates List */}
      <CandidateList
        candidates={candidates}
        isLoading={isLoading}
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onDelete={handleDelete}
        onAssignUsers={handleAssignUsers}
      />
    </div>
  )
}

export default CandidatesPage
