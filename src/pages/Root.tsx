import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const Root = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('fintrack_token')
    navigate(token ? '/dashboard' : '/login', { replace: true })
  }, [navigate])

  return null
}
