import { useSocket } from '../../context/SocketContext'
import { 
  SignalIcon, 
  SignalSlashIcon 
} from '@heroicons/react/24/outline'

const ConnectionStatus = () => {
  const { isConnected } = useSocket()

  return (
    <div className="flex items-center">
      {isConnected ? (
        <>
          <SignalIcon className="h-4 w-4 text-green-500" />
          <span className="ml-1 text-sm text-green-600">Connected</span>
        </>
      ) : (
        <>
          <SignalSlashIcon className="h-4 w-4 text-red-500" />
          <span className="ml-1 text-sm text-red-600">Disconnected</span>
        </>
      )}
    </div>
  )
}

export default ConnectionStatus
