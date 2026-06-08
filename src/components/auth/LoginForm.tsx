import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthCard } from './AuthCard'

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
      setError('Invalid email or password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title="Sign in" subtitle="Welcome back to FinTrack">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-[var(--expense-dim)] border border-[rgba(248,81,73,0.3)] rounded-lg px-3.5 py-2.5 text-[var(--expense)] text-sm">
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
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-3 top-[26px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Sign In
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-[var(--neutral)] hover:underline">
            Register →
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
