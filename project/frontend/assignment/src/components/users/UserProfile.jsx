import { useState } from 'react'
import { formatDate } from '../../utils/formatters'
import { USER_ROLES } from '../../utils/constants'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CalendarIcon,
  PencilIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const UserProfile = ({ 
  user, 
  onUpdate, 
  onDeactivate,
  onActivate,
  canEdit = false 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return 'bg-red-100 text-red-800'
      case USER_ROLES.RECRUITER:
        return 'bg-blue-100 text-blue-800'
      case USER_ROLES.HIRING_MANAGER:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getStatusIcon = (isActive) => {
    return isActive ? (
      <CheckCircleIcon className="h-5 w-5 text-green-500" />
    ) : (
      <XCircleIcon className="h-5 w-5 text-red-500" />
    )
  }

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      setIsDeactivating(true)
      try {
        await onDeactivate(user.id)
      } catch (error) {
        console.error('Error deactivating user:', error)
      } finally {
        setIsDeactivating(false)
      }
    }
  }

  const handleActivate = async () => {
    setIsDeactivating(true)
    try {
      await onActivate(user.id)
    } catch (error) {
      console.error('Error activating user:', error)
    } finally {
      setIsDeactivating(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">User not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The user you're looking for doesn't exist or has been removed.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 h-16 w-16">
              <div className="h-16 w-16 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-2xl font-medium text-white">
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(user.isActive)}`}>
              {getStatusIcon(user.isActive)}
              <span className="ml-1">{user.isActive ? 'Active' : 'Inactive'}</span>
            </span>
            {canEdit && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PencilIcon className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {user.email}
                </dd>
              </div>
              
              {user.phone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900 flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {user.phone}
                  </dd>
                </div>
              )}
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 capitalize">{user.role}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
                    {getStatusIcon(user.isActive)}
                    <span className="ml-1">{user.isActive ? 'Active' : 'Inactive'}</span>
                  </span>
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {formatDate(user.createdAt)}
                </dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                  {formatDate(user.updatedAt)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-gray-900">{user.candidateCount || 0}</p>
                <p className="text-sm text-gray-500">Candidates</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-gray-900">{user.noteCount || 0}</p>
                <p className="text-sm text-gray-500">Notes</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-gray-900">{user.assignedCandidates || 0}</p>
                <p className="text-sm text-gray-500">Assigned</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-gray-900">{user.activeCandidates || 0}</p>
                <p className="text-sm text-gray-500">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {canEdit && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            {user.isActive ? (
              <button
                onClick={handleDeactivate}
                disabled={isDeactivating}
                className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {isDeactivating ? 'Deactivating...' : 'Deactivate User'}
              </button>
            ) : (
              <button
                onClick={handleActivate}
                disabled={isDeactivating}
                className="px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isDeactivating ? 'Activating...' : 'Activate User'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
