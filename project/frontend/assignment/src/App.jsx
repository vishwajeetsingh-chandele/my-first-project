import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { ErrorBoundary } from './components/common/ErrorBoundary.jsx'
import { ProtectedRoute } from './components/auth/ProtectedRoute.jsx'
import { Layout } from './components/common/Layout.jsx'

// Pages
import LoginPage from './pages/auth/LoginPage.jsx'
import RegisterPage from './pages/auth/RegisterPage.jsx'
import DashboardPage from './pages/dashboard/DashboardPage.jsx'
import CandidatesPage from './pages/candidates/CandidatesPage.jsx'
import CreateCandidatePage from './pages/candidates/CreateCandidatePage.jsx'
import CandidateDetailsPage from './pages/candidates/CandidateDetailsPage.jsx'
import NotificationsPage from './pages/notifications/NotificationsPage.jsx'
import UsersPage from './pages/users/UsersPage.jsx'

import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <Router>
              <div className="min-h-screen bg-gray-50">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/" element={
                    <ProtectedRoute>
                      <Layout>
                        <DashboardPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/candidates" element={
                    <ProtectedRoute>
                      <Layout>
                        <CandidatesPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/candidates/create" element={
                    <ProtectedRoute>
                      <Layout>
                        <CreateCandidatePage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/candidates/:id" element={
                    <ProtectedRoute>
                      <Layout>
                        <CandidateDetailsPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <Layout>
                        <NotificationsPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/users" element={
                    <ProtectedRoute>
                      <Layout>
                        <UsersPage />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  
                  {/* Redirect to dashboard for any unknown routes */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                
                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                    success: {
                      duration: 3000,
                      iconTheme: {
                        primary: '#10B981',
                        secondary: '#fff',
                      },
                    },
                    error: {
                      duration: 5000,
                      iconTheme: {
                        primary: '#EF4444',
                        secondary: '#fff',
                      },
                    },
                  }}
                />
              </div>
            </Router>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
