import { useState } from 'react'
import { formatDate, formatRelativeTime } from '../../utils/formatters'
import { CANDIDATE_STATUS } from '../../utils/constants'
import Loading from '../common/Loading'

const CandidateDetails = ({ 
  candidate, 
  isLoading, 
  onUpdate, 
  onDelete, 
  onAssignUsers 
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const getStatusColor = (status) => {
    switch (status) {
      case CANDIDATE_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800'
      case CANDIDATE_STATUS.INACTIVE:
        return 'bg-gray-100 text-gray-800'
      case CANDIDATE_STATUS.HIRED:
        return 'bg-blue-100 text-blue-800'
      case CANDIDATE_STATUS.REJECTED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
      setIsDeleting(true)
      try {
        await onDelete(candidate.id)
      } catch (error) {
        console.error('Error deleting candidate:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  if (isLoading) {
    return <Loading text="Loading candidate details..." />
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Candidate not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The candidate you're looking for doesn't exist or has been removed.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
            <p className="text-sm text-gray-500">
              Added {formatRelativeTime(candidate.createdAt)}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
              {candidate.status}
            </span>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
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
                <dd className="mt-1 text-sm text-gray-900">{candidate.email}</dd>
              </div>
              
              {candidate.phone && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.phone}</dd>
                </div>
              )}
              
              {candidate.experience && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Experience</dt>
                  <dd className="mt-1 text-sm text-gray-900">{candidate.experience} years</dd>
                </div>
              )}
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(candidate.createdAt)}</dd>
              </div>
              
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">{formatDate(candidate.updatedAt)}</dd>
              </div>
            </dl>
          </div>

          {/* Skills and Assignments */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Skills & Assignments</h3>
            
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="mb-6">
                <dt className="text-sm font-medium text-gray-500 mb-2">Skills</dt>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {candidate.assignedUsers && candidate.assignedUsers.length > 0 && (
              <div>
                <dt className="text-sm font-medium text-gray-500 mb-2">Assigned Users</dt>
                <div className="flex flex-wrap gap-2">
                  {candidate.assignedUsers.map((user, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {user.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        {candidate.notes && (
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
            <div className="prose max-w-none">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{candidate.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CandidateDetails
