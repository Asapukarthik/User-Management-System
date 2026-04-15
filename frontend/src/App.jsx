import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import CreateUser from './pages/CreateUser'
import EditUser from './pages/EditUser'
import UserDetails from './pages/UserDetails'
import Profile from './pages/Profile'
import AuditLogs from './pages/AuditLogs'
import Register from './pages/Register'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/403" element={<Unauthorized />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />

            <Route
              path="users"
              element={
                <ProtectedRoute roles={['admin', 'manager']}>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/create"
              element={
                <ProtectedRoute roles={['admin', 'manager']}>
                  <CreateUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/:id/edit"
              element={
                <ProtectedRoute roles={['admin', 'manager']}>
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/:id"
              element={
                <ProtectedRoute roles={['admin', 'manager']}>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="audit-logs"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
