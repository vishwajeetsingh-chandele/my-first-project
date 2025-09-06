import { useState } from 'react'
import UserCard from './UserCard'
import SearchInput from '../common/SearchInput'
import Loading from '../common/Loading'
import { USER_ROLES } from '../../utils/constants'

const UserList = ({ 
  users, 
  isLoading, 
  onSearch, 
  onRoleFilter,
  onEdit,
  onDeactivate,
  onActivate,
  canEdit = false 
}) => {
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term) => {
    setSearchTerm(term)
    onSearch(term)
  }

  const handleRoleFilter = (role) => {
    setSelectedRole(role)
    onRoleFilter(role)
  }

  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: USER_ROLES.ADMIN, label: 'Admin' },
    { value: USER_ROLES.RECRUITER, label: 'Recruiter' },
    { value: USER_ROLES.HIRING_MANAGER, label: 'Hiring Manager' }
  ]

  if (isLoading) {
    return <Loading text="Loading users..." />
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="role-filter" className="text-sm font-medium text-gray-700">
            Filter by role:
          </label>
          <select
            id="role-filter"
            value={selectedRole}
            onChange={(e) => handleRoleFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {roleOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Grid */}
      {users.length === 0 ? (
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedRole !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No users have been added yet.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={onEdit}
              onDeactivate={onDeactivate}
              onActivate={onActivate}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}

      {/* Results Summary */}
      {users.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Showing {users.length} user{users.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedRole !== 'all' && ` with role "${roleOptions.find(opt => opt.value === selectedRole)?.label}"`}
        </div>
      )}
    </div>
  )
}

export default UserList
