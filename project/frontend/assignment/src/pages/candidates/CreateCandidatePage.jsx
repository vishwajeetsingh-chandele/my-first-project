import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useCandidates  from '../../hooks/useCandidates'
import CandidateForm from '../../components/candidates/CandidateForm'
import Loading from '../../components/common/Loading'
import toast from 'react-hot-toast'

const CreateCandidatePage = () => {
  const navigate = useNavigate()
  const { createCandidate, isLoading } = useCandidates()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (candidateData) => {
    setIsSubmitting(true)
    
    try {
      const result = await createCandidate(candidateData)
      
      if (result.success) {
        toast.success('Candidate created successfully!')
        navigate('/candidates')
      } else {
        toast.error(result.error || 'Failed to create candidate')
      }
    } catch (error) {
      console.error('Error creating candidate:', error)
      toast.error('Failed to create candidate')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/candidates')
  }

  if (isLoading) {
    return <Loading text="Creating candidate..." />
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Candidate</h1>
        <p className="mt-1 text-sm text-gray-600">
          Add a new candidate to your pipeline.
        </p>
      </div>

      <CandidateForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
        submitText="Create Candidate"
      />
    </div>
  )
}

export default CreateCandidatePage
