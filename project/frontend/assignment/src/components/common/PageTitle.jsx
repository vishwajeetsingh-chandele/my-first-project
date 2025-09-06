import { useLocation } from 'react-router-dom'

const PageTitle = () => {
  const location = useLocation()

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Dashboard'
      case '/candidates':
        return 'Candidates'
      case '/candidates/create':
        return 'Create Candidate'
      case '/notifications':
        return 'Notifications'
      case '/users':
        return 'Users'
      default:
        if (location.pathname.startsWith('/candidates/')) {
          return 'Candidate Details'
        }
        return 'Page'
    }
  }

  return (
    <h1 className="text-2xl font-semibold text-gray-900">
      {getPageTitle()}
    </h1>
  )
}

export default PageTitle
