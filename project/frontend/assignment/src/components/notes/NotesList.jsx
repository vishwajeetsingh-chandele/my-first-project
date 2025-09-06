import { useState } from 'react'
import { formatDate, formatRelativeTime } from '../../utils/formatters'
import { NOTE_TYPES, NOTE_PRIORITIES } from '../../utils/constants'
import Loading from '../common/Loading'

const NotesList = ({ 
  notes, 
  isLoading, 
  onEdit, 
  onDelete, 
  onAddReaction,
  onRemoveReaction 
}) => {
  const [expandedNote, setExpandedNote] = useState(null)

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

  const handleReactionClick = (noteId, reactionType) => {
    const note = notes.find(n => n.id === noteId)
    if (!note) return

    const existingReaction = note.reactions?.find(r => r.type === reactionType)
    if (existingReaction) {
      onRemoveReaction(noteId, reactionType)
    } else {
      onAddReaction(noteId, reactionType)
    }
  }

  const getReactionCount = (note, reactionType) => {
    return note.reactions?.filter(r => r.type === reactionType).length || 0
  }

  if (isLoading) {
    return <Loading text="Loading notes..." />
  }

  return (
    <div className="space-y-4">
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start the conversation by adding the first note.
          </p>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
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
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
            </div>

            {/* Note Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Reactions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleReactionClick(note.id, 'like')}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <span>👍</span>
                    <span>{getReactionCount(note, 'like')}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReactionClick(note.id, 'dislike')}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <span>👎</span>
                    <span>{getReactionCount(note, 'dislike')}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReactionClick(note.id, 'love')}
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <span>❤️</span>
                    <span>{getReactionCount(note, 'love')}</span>
                  </button>
                </div>

                {/* Edit/Delete Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(note)}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(note.id)}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Expand/Collapse for long notes */}
              {note.content.length > 200 && (
                <button
                  onClick={() => setExpandedNote(expandedNote === note.id ? null : note.id)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  {expandedNote === note.id ? 'Show less' : 'Show more'}
                </button>
              )}
            </div>

            {/* Expanded Content */}
            {expandedNote === note.id && note.content.length > 200 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default NotesList
