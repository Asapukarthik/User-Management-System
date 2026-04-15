import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { hasAnyRole } from '../utils/roles'
import Loader from './Loader'

const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <Loader fullScreen label="Checking session..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!hasAnyRole(role, roles)) {
    return <Navigate to="/403" replace />
  }

  return children
}

export default ProtectedRoute
