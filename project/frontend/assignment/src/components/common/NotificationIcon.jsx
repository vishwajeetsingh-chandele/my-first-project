import { BellIcon } from '@heroicons/react/24/outline'
import { useNotifications } from '../../context/NotificationContext'

const NotificationIcon = () => {
  const { unreadCount } = useNotifications()

  return (
    <div className="relative">
      <BellIcon className="h-6 w-6 text-gray-400 hover:text-gray-500" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  )
}

export default NotificationIcon
