import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import  useCandidates  from '../../hooks/useCandidates'
import useNotes  from '../../hooks/useNotes'
import { useSocket } from '../../context/SocketContext'
import CandidateDetails from '../../components/candidates/CandidateDetails'
import NotesList from '../../components/notes/NotesList'
import NoteForm from '../../components/notes/NoteForm'
import Loading from '../../components/common/Loading'
import toast from 'react-hot-toast'

const CandidateDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { candidates, isLoading: candidatesLoading, updateCandidate, deleteCandidate } = useCandidates()
  const { notes, isLoading: notesLoading, createNote, updateNote, deleteNote } = useNotes(id)
  const { socket } = useSocket()
  
  const [candidate, setCandidate] = useState(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    if (candidates.length > 0) {
      const foundCandidate = candidates.find(c => c.id === id)
      if (foundCandidate) {
        setCandidate(foundCandidate)
      } else {
        toast.error('Candidate not found')
        navigate('/candidates')
      }
    }
  }, [candidates, id, navigate])

  useEffect(() => {
    if (socket && candidate) {
      // Join candidate room for real-time updates
      socket.emit('joinCandidateRoom', { candidateId: candidate.id })
      
      return () => {
        socket.emit('leaveCandidateRoom', { candidateId: candidate.id })
      }
    }
  }, [socket, candidate])

  const handleUpdateCandidate = async (updatedData) => {
    try {
      const result = await updateCandidate(candidate.id, updatedData)
      if (result.success) {
        setCandidate(prev => ({ ...prev, ...updatedData }))
        setIsEditing(false)
        toast.success('Candidate updated successfully!')
      } else {
        toast.error(result.error || 'Failed to update candidate')
      }
    } catch (error) {
      console.error('Error updating candidate:', error)
      toast.error('Failed to update candidate')
    }
  }

  const handleDeleteCandidate = async () => {
    if (window.confirm('Are you sure you want to delete this candidate? This action cannot be undone.')) {
      try {
        const result = await deleteCandidate(candidate.id)
        if (result.success) {
          toast.success('Candidate deleted successfully!')
          navigate('/candidates')
        } else {
          toast.error(result.error || 'Failed to delete candidate')
        }
      } catch (error) {
        console.error('Error deleting candidate:', error)
        toast.error('Failed to delete candidate')
      }
    }
  }

  const handleCreateNote = async (noteData) => {
    try {
      const result = await createNote(noteData)
      if (result.success) {
        toast.success('Note created successfully!')
      } else {
        toast.error(result.error || 'Failed to create note')
      }
    } catch (error) {
      console.error('Error creating note:', error)
      toast.error('Failed to create note')
    }
  }

  const handleUpdateNote = async (noteId, noteData) => {
    try {
      const result = await updateNote(noteId, noteData)
      if (result.success) {
        toast.success('Note updated successfully!')
      } else {
        toast.error(result.error || 'Failed to update note')
      }
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error('Failed to update note')
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        const result = await deleteNote(noteId)
        if (result.success) {
          toast.success('Note deleted successfully!')
        } else {
          toast.error(result.error || 'Failed to delete note')
        }
      } catch (error) {
        console.error('Error deleting note:', error)
        toast.error('Failed to delete note')
      }
    }
  }

  if (candidatesLoading) {
    return <Loading text="Loading candidate..." />
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Candidate not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The candidate you're looking for doesn't exist or has been deleted.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Candidate Details */}
      <CandidateDetails
        candidate={candidate}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onCancel={() => setIsEditing(false)}
        onSave={handleUpdateCandidate}
        onDelete={handleDeleteCandidate}
      />

      {/* Notes Section */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Notes & Comments</h3>
          <p className="mt-1 text-sm text-gray-600">
            Share feedback and collaborate on this candidate.
          </p>
        </div>
        
        <div className="p-6">
          {/* Add Note Form */}
          <div className="mb-6">
            <NoteForm onSubmit={handleCreateNote} candidateId={candidate.id} />
          </div>
          
          {/* Notes List */}
          <NotesList
            notes={notes}
            isLoading={notesLoading}
            onEdit={handleUpdateNote}
            onDelete={handleDeleteNote}
          />
        </div>
      </div>
    </div>
  )
}

export default CandidateDetailsPage
