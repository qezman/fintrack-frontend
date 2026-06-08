import { Navigate, Outlet } from 'react-router-dom'

export const ProtectedRoute = () => {
  const token = localStorage.getItem('fintrack_token')
  return token ? <Outlet /> : <Navigate to="/login" replace />
}
