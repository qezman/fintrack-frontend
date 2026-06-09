import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthCard } from './AuthCard'

const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Cannot reach the server — check your connection or backend.'
    const msg = err.response.data?.message as string | undefined
    return msg ?? `Server error (${err.response.status}). Please try again.`
  }
  return 'An unexpected error occurred. Please try again.'
}

export const LoginForm = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title="Sign in" subtitle="Welcome back to FinTrack">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-[var(--expense-dim)] border border-[rgba(248,81,73,0.3)] rounded-lg px-3.5 py-2.5 text-[var(--expense)] text-sm leading-relaxed">
            {error}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="hover:text-[var(--text-secondary)] transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--neutral)] hover:underline font-medium">
            Create one →
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
