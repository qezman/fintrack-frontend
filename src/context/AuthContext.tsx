import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, LoginPayload, RegisterPayload } from '@/types'
import { login as loginApi, register as registerApi } from '@/api/auth'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const stored = localStorage.getItem('fintrack_user')
  const [user, setUser] = useState<User | null>(
    stored ? (JSON.parse(stored) as User) : null
  )

  const login = useCallback(async (payload: LoginPayload): Promise<void> => {
    const data = await loginApi(payload)
    localStorage.setItem('fintrack_token', data.token)
    localStorage.setItem('fintrack_user', JSON.stringify(data.user))
    setUser(data.user)
  }, [])

  const register = useCallback(async (payload: RegisterPayload): Promise<void> => {
    const data = await registerApi(payload)
    localStorage.setItem('fintrack_token', data.token)
    localStorage.setItem('fintrack_user', JSON.stringify(data.user))
    setUser(data.user)
  }, [])

  const logout = useCallback((): void => {
    localStorage.removeItem('fintrack_token')
    localStorage.removeItem('fintrack_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
