import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatters'
import { CANDIDATE_STATUS } from '../../utils/constants'

const CandidateCard = ({ candidate }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            <Link 
              to={`/candidates/${candidate.id}`}
              className="hover:text-indigo-600"
            >
              {candidate.name}
            </Link>
          </h3>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {candidate.email}
            </p>
            
            {candidate.phone && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {candidate.phone}
              </p>
            )}
            
            {candidate.experience && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Experience:</span> {candidate.experience} years
              </p>
            )}
            
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {candidate.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{candidate.skills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
            {candidate.status}
          </span>
          
          <p className="text-xs text-gray-500">
            Added {formatDate(candidate.createdAt)}
          </p>
        </div>
      </div>
      
      {candidate.assignedUsers && candidate.assignedUsers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Assigned to:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {candidate.assignedUsers.map((user, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                {user.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CandidateCard
