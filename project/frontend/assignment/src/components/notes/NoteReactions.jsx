import { 
  HeartIcon, 
  HandThumbUpIcon, 
  HandThumbDownIcon,
  FaceFrownIcon,
  FaceSmileIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

const NoteReactions = ({ 
  note, 
  currentUserId, 
  onAddReaction, 
  onRemoveReaction 
}) => {
  const reactions = [
    { type: 'like', icon: HandThumbUpIcon, label: 'Like' },
    { type: 'dislike', icon: HandThumbDownIcon, label: 'Dislike' },
    { type: 'love', icon: HeartIcon, label: 'Love' },
    { type: 'smile', icon: FaceSmileIcon, label: 'Smile' },
    { type: 'frown', icon: FaceFrownIcon, label: 'Frown' }
  ]

  const getReactionCount = (reactionType) => {
    return note.reactions?.filter(r => r.type === reactionType).length || 0
  }

  const hasUserReacted = (reactionType) => {
    return note.reactions?.some(r => r.type === reactionType && r.userId === currentUserId) || false
  }

  const handleReactionClick = (reactionType) => {
    if (hasUserReacted(reactionType)) {
      onRemoveReaction(note.id, reactionType)
    } else {
      onAddReaction(note.id, reactionType)
    }
  }

  const getReactionIcon = (reactionType, IconComponent) => {
    const isActive = hasUserReacted(reactionType)
    const count = getReactionCount(reactionType)
    
    if (count === 0) return null

    return (
      <button
        key={reactionType}
        onClick={() => handleReactionClick(reactionType)}
        className={`flex items-center space-x-1 text-sm transition-colors ${
          isActive 
            ? 'text-indigo-600 hover:text-indigo-700' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        title={`${reactionType} (${count})`}
      >
        <IconComponent className={`h-4 w-4 ${isActive ? 'fill-current' : ''}`} />
        <span>{count}</span>
      </button>
    )
  }

  return (
    <div className="flex items-center space-x-3">
      {reactions.map(({ type, icon: IconComponent }) => 
        getReactionIcon(type, IconComponent)
      )}
      
      {/* Add Reaction Button */}
      <div className="relative group">
        <button className="text-gray-400 hover:text-gray-600 text-sm">
          <span className="text-lg">😊</span>
        </button>
        
        {/* Reaction Picker (could be expanded) */}
        <div className="absolute bottom-full left-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex space-x-1">
            {reactions.map(({ type, icon: IconComponent, label }) => (
              <button
                key={type}
                onClick={() => handleReactionClick(type)}
                className="p-1 hover:bg-gray-100 rounded"
                title={label}
              >
                <IconComponent className="h-4 w-4 text-gray-600" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoteReactions
