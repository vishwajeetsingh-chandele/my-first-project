import { useState } from 'react'
import CandidateCard from './CandidateCard'
import SearchInput from '../common/SearchInput'
import Loading from '../common/Loading'
import { CANDIDATE_STATUS } from '../../utils/constants'

const CandidateList = ({ 
  candidates, 
  isLoading, 
  onSearch, 
  onStatusFilter,
  onDelete,
  onAssignUsers 
}) => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term) => {
    setSearchTerm(term)
    onSearch(term)
  }

  const handleStatusFilter = (status) => {
    setSelectedStatus(status)
    onStatusFilter(status)
  }

  const statusOptions = [
    { value: 'all', label: 'All Candidates' },
    { value: CANDIDATE_STATUS.ACTIVE, label: 'Active' },
    { value: CANDIDATE_STATUS.INACTIVE, label: 'Inactive' },
    { value: CANDIDATE_STATUS.HIRED, label: 'Hired' },
    { value: CANDIDATE_STATUS.REJECTED, label: 'Rejected' }
  ]

  if (isLoading) {
    return <Loading text="Loading candidates..." />
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
            Filter by status:
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidates Grid */}
      {candidates.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No candidates found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating a new candidate.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onDelete={onDelete}
              onAssignUsers={onAssignUsers}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {candidates.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {candidates.length} candidate{candidates.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedStatus !== 'all' && ` with status "${statusOptions.find(opt => opt.value === selectedStatus)?.label}"`}
        </div>
      )}
    </div>
  )
}

export default CandidateList
