import { useState, useRef, useEffect } from 'react'
import { useFormValidation } from '../../utils/validation'
import { NOTE_TYPES, NOTE_PRIORITIES } from '../../utils/constants'

const NoteEditor = ({ 
  note, 
  onSubmit, 
  onCancel, 
  isLoading, 
  users = [] 
}) => {
  const [formData, setFormData] = useState({
    content: note?.content || '',
    type: note?.type || NOTE_TYPES.GENERAL,
    priority: note?.priority || NOTE_PRIORITIES.MEDIUM
  })

  const [errors, setErrors] = useState({})
  const [showMentions, setShowMentions] = useState(false)
  const [mentionQuery, setMentionQuery] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  
  const textareaRef = useRef(null)
  const { validateForm } = useFormValidation()

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }

    // Handle mentions
    if (name === 'content') {
      const cursorPos = e.target.selectionStart
      setCursorPosition(cursorPos)
      
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
  }

  const handleMentionSelect = (user) => {
    const textBeforeCursor = formData.content.substring(0, cursorPosition)
    const textAfterCursor = formData.content.substring(cursorPosition)
    const mentionText = `@${user.name} `
    
    const newContent = textBeforeCursor.replace(/@\w*$/, mentionText) + textAfterCursor
    setFormData(prev => ({
      ...prev,
      content: newContent
    }))
    
    setShowMentions(false)
    setMentionQuery('')
    
    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = textBeforeCursor.length + mentionText.length
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { isValid, errors: validationErrors } = validateForm(formData, require('../../utils/validation').validationSchemas.note)
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(mentionQuery.toLowerCase())
  )

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Note Content *
          </label>
          <div className="relative">
            <textarea
              ref={textareaRef}
              name="content"
              id="content"
              rows={4}
              value={formData.content}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.content ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''
              }`}
              placeholder="Write your note here... Use @ to mention users"
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
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Note Type
            </label>
            <select
              name="type"
              id="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={NOTE_TYPES.GENERAL}>General</option>
              <option value={NOTE_TYPES.INTERVIEW}>Interview</option>
              <option value={NOTE_TYPES.FEEDBACK}>Feedback</option>
              <option value={NOTE_TYPES.DECISION}>Decision</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              name="priority"
              id="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value={NOTE_PRIORITIES.LOW}>Low</option>
              <option value={NOTE_PRIORITIES.MEDIUM}>Medium</option>
              <option value={NOTE_PRIORITIES.HIGH}>High</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : note ? 'Update Note' : 'Add Note'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NoteEditor
