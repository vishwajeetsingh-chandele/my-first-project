import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { useSocket } from '../../context/SocketContext'
import { 
  UserGroupIcon, 
  BellIcon, 
  DocumentTextIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const DashboardPage = () => {
  const { user } = useAuth()
  const { unreadCount } = useNotifications()
  const { isConnected } = useSocket()

  const stats = [
    {
      name: 'Total Candidates',
      value: '0',
      icon: UserGroupIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Unread Notifications',
      value: (unreadCount ?? 0).toString(), // ✅ Safe fallback
      icon: BellIcon,
      color: 'bg-red-500'
    },
    {
      name: 'Total Notes',
      value: '0',
      icon: DocumentTextIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Active Users',
      value: isConnected ? '1' : '0',
      icon: ChartBarIcon,
      color: 'bg-purple-500'
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back, {user?.name}! Here's what's happening with your candidates.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} p-3 rounded-md`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
                <UserGroupIcon className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" />
                Add New Candidate
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Create a new candidate profile and start tracking their progress.
              </p>
            </div>
          </button>

          <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                <DocumentTextIcon className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" />
                View All Notes
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Browse through all notes and comments across candidates.
              </p>
            </div>
          </button>

          <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-300 hover:border-gray-400">
            <div>
              <span className="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
                <BellIcon className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" />
                Check Notifications
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Review your latest notifications and mentions.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="px-6 py-4">
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first candidate or adding a note.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
