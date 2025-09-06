import { useState } from 'react'
import { CANDIDATE_STATUS } from '../../utils/constants'
import SearchInput from '../common/SearchInput'

const CandidateFilters = ({ 
  onSearch,
  onStatusFilter,
  searchTerm = '',
  statusFilter = 'all'
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: CANDIDATE_STATUS.ACTIVE, label: 'Active' },
    { value: CANDIDATE_STATUS.INACTIVE, label: 'Inactive' },
    { value: CANDIDATE_STATUS.HIRED, label: 'Hired' },
    { value: CANDIDATE_STATUS.REJECTED, label: 'Rejected' }
  ]

  const handleSearchChange = (term) => {
    onSearch(term)
  }

  const handleStatusChange = (status) => {
    onStatusFilter(status)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1 max-w-md">
        <SearchInput
          placeholder="Search candidates..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
          Filter by status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => handleStatusChange(e.target.value)}
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
  )
}

export default CandidateFilters
