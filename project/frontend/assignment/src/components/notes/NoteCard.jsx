import { useState } from 'react'
import { formatRelativeTime } from '../../utils/formatters'
import { NOTE_TYPES, NOTE_PRIORITIES } from '../../utils/constants'
import { 
  ChatBubbleLeftIcon,
  PencilIcon,
  TrashIcon,
  HeartIcon,
  HandThumbUpIcon,
  HandThumbDownIcon
} from '@heroicons/react/24/outline'

const NoteCard = ({ 
  note, 
  onEdit, 
  onDelete, 
  onAddReaction,
  onRemoveReaction,
  canEdit = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const getTypeColor = (type) => {
    switch (type) {
      case NOTE_TYPES.GENERAL:
        return 'bg-blue-100 text-blue-800'
      case NOTE_TYPES.INTERVIEW:
        return 'bg-green-100 text-green-800'
      case NOTE_TYPES.FEEDBACK:
        return 'bg-yellow-100 text-yellow-800'
      case NOTE_TYPES.DECISION:
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case NOTE_PRIORITIES.HIGH:
        return 'bg-red-100 text-red-800'
      case NOTE_PRIORITIES.MEDIUM:
        return 'bg-yellow-100 text-yellow-800'
      case NOTE_PRIORITIES.LOW:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getReactionCount = (reactionType) => {
    return note.reactions?.filter(r => r.type === reactionType).length || 0
  }

  const hasUserReacted = (reactionType) => {
    // This would need to be implemented based on current user
    return false
  }

  const handleReactionClick = (reactionType) => {
    if (hasUserReacted(reactionType)) {
      onRemoveReaction(note.id, reactionType)
    } else {
      onAddReaction(note.id, reactionType)
    }
  }

  const shouldTruncate = note.content.length > 200
  const displayContent = shouldTruncate && !isExpanded 
    ? note.content.substring(0, 200) + '...' 
    : note.content

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Note Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-8 w-8">
            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {note.author?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{note.author?.name}</p>
            <p className="text-xs text-gray-500">{formatRelativeTime(note.createdAt)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(note.type)}`}>
            {note.type}
          </span>
          {note.priority && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(note.priority)}`}>
              {note.priority}
            </span>
          )}
        </div>
      </div>

      {/* Note Content */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{displayContent}</p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Note Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Reactions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleReactionClick('like')}
              className={`flex items-center space-x-1 text-sm ${
                hasUserReacted('like') ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HandThumbUpIcon className="h-4 w-4" />
              <span>{getReactionCount('like')}</span>
            </button>
            
            <button
              onClick={() => handleReactionClick('dislike')}
              className={`flex items-center space-x-1 text-sm ${
                hasUserReacted('dislike') ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HandThumbDownIcon className="h-4 w-4" />
              <span>{getReactionCount('dislike')}</span>
            </button>
            
            <button
              onClick={() => handleReactionClick('love')}
              className={`flex items-center space-x-1 text-sm ${
                hasUserReacted('love') ? 'text-red-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HeartIcon className="h-4 w-4" />
              <span>{getReactionCount('love')}</span>
            </button>
          </div>

          {/* Edit/Delete Actions */}
          {canEdit && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(note)}
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center space-x-1"
              >
                <PencilIcon className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(note.id)}
                className="text-sm text-red-600 hover:text-red-500 flex items-center space-x-1"
              >
                <TrashIcon className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <ChatBubbleLeftIcon className="h-4 w-4" />
          <span>Note</span>
        </div>
      </div>
    </div>
  )
}

export default NoteCard
