import { formatDate } from '../../utils/formatters'
import { USER_ROLES } from '../../utils/constants'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const UserCard = ({ 
  user, 
  onEdit, 
  onDeactivate, 
  onActivate,
  canEdit = false 
}) => {
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
      <CheckCircleIcon className="h-4 w-4 text-green-500" />
    ) : (
      <XCircleIcon className="h-4 w-4 text-red-500" />
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-12 w-12">
            <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-lg font-medium text-white">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
            {user.role}
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.isActive)}`}>
            {getStatusIcon(user.isActive)}
            <span className="ml-1">{user.isActive ? 'Active' : 'Inactive'}</span>
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {user.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
            <span>{user.phone}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>{user.email}</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
          <span>Joined {formatDate(user.createdAt)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-gray-900">{user.candidateCount || 0}</p>
            <p className="text-xs text-gray-500">Candidates</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-900">{user.noteCount || 0}</p>
            <p className="text-xs text-gray-500">Notes</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {canEdit && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
          <button
            onClick={() => onEdit(user)}
            className="px-3 py-1 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Edit
          </button>
          {user.isActive ? (
            <button
              onClick={() => onDeactivate(user.id)}
              className="px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Deactivate
            </button>
          ) : (
            <button
              onClick={() => onActivate(user.id)}
              className="px-3 py-1 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Activate
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default UserCard
