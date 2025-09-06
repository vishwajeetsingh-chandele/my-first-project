import { useSocket } from '../../context/SocketContext'
import { formatInitials } from '../../utils/formatters'

const OnlineUsers = ({ className = "" }) => {
  const { onlineUsers } = useSocket()

  if (!onlineUsers || onlineUsers.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
        <h3 className="text-sm font-medium text-gray-900 mb-2">Online Users</h3>
        <p className="text-sm text-gray-500">No users online</p>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-900 mb-3">
        Online Users ({onlineUsers.length})
      </h3>
      
      <div className="space-y-2">
        {onlineUsers.map((user) => (
          <div key={user.id} className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-xs font-medium text-white">
                  {formatInitials(user.name)}
                </span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OnlineUsers
