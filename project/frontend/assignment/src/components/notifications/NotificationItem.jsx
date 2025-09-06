import { formatRelativeTime } from '../../utils/formatters'
import { NOTIFICATION_TYPES } from '../../utils/constants'
import { 
  BellIcon, 
  UserPlusIcon, 
  ChatBubbleLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.NEW_NOTE:
        return <ChatBubbleLeftIcon className="h-5 w-5 text-blue-500" />
      case NOTIFICATION_TYPES.MENTION:
        return <UserPlusIcon className="h-5 w-5 text-green-500" />
      case NOTIFICATION_TYPES.ASSIGNMENT:
        return <BellIcon className="h-5 w-5 text-yellow-500" />
      case NOTIFICATION_TYPES.STATUS_CHANGE:
        return <CheckCircleIcon className="h-5 w-5 text-purple-500" />
      default:
        return <ExclamationTriangleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type) => {
    switch (type) {
      case NOTIFICATION_TYPES.NEW_NOTE:
        return 'bg-blue-50 border-blue-200'
      case NOTIFICATION_TYPES.MENTION:
        return 'bg-green-50 border-green-200'
      case NOTIFICATION_TYPES.ASSIGNMENT:
        return 'bg-yellow-50 border-yellow-200'
      case NOTIFICATION_TYPES.STATUS_CHANGE:
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const handleMarkAsRead = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id)
    }
  }

  const handleDelete = () => {
    onDelete(notification.id)
  }

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        notification.isRead 
          ? 'bg-white border-gray-200' 
          : `${getNotificationColor(notification.type)} border-l-4`
      }`}
      onClick={handleMarkAsRead}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className={`text-sm font-medium ${
              notification.isRead ? 'text-gray-900' : 'text-gray-900'
            }`}>
              {notification.title}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {formatRelativeTime(notification.createdAt)}
              </span>
              {!notification.isRead && (
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              )}
            </div>
          </div>
          
          <p className={`mt-1 text-sm ${
            notification.isRead ? 'text-gray-600' : 'text-gray-700'
          }`}>
            {notification.message}
          </p>
          
          {notification.metadata && (
            <div className="mt-2 text-xs text-gray-500">
              {notification.metadata.candidateName && (
                <span>Candidate: {notification.metadata.candidateName}</span>
              )}
              {notification.metadata.authorName && (
                <span className="ml-2">By: {notification.metadata.authorName}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete()
            }}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
