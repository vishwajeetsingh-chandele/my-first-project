import { useState, useRef, useEffect } from 'react'

const MentionInput = ({ 
  value, 
  onChange, 
  onMentionSelect,
  users = [],
  placeholder = "Type @ to mention someone...",
  className = "",
  disabled = false 
}) => {
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef(null)

  const handleInputChange = (e) => {
    const value = e.target.value
    const cursorPos = e.target.selectionStart
    setCursorPosition(cursorPos)
    
    onChange(value)
    
    // Check for @ mention
    const textBeforeCursor = value.substring(0, cursorPos)
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
    
    if (mentionMatch) {
      setMentionQuery(mentionMatch[1])
      setShowMentions(true)
    } else {
      setShowMentions(false)
    }
  }

  const handleMentionSelect = (user) => {
    const textBeforeCursor = value.substring(0, cursorPosition)
    const textAfterCursor = value.substring(cursorPosition)
    const mentionText = `@${user.name} `
    
    const newValue = textBeforeCursor.replace(/@\w*$/, mentionText) + textAfterCursor
    onChange(newValue)
    
    setShowMentions(false)
    setMentionQuery('')
    
    // Focus back to input
    setTimeout(() => {
      if (inputRef.current) {
        const newCursorPos = textBeforeCursor.length + mentionText.length
        inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
        inputRef.current.focus()
      }
    }, 0)

    // Call the onMentionSelect callback if provided
    if (onMentionSelect) {
      onMentionSelect(user)
    }
  }

  const handleKeyDown = (e) => {
    if (showMentions && e.key === 'Escape') {
      setShowMentions(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : ''
        }`}
        placeholder={placeholder}
      />
      
      {/* Mentions Dropdown */}
      {showMentions && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleMentionSelect(user)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-6 w-6">
                    <div className="h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No users found
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MentionInput
