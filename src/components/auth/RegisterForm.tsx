import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthCard } from './AuthCard'

export const RegisterForm = () => {
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!name.trim()) newErrors.name = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format'
    if (password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords must match'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    
    setIsLoading(true)
    setApiError(null)
    
    try {
      await register({ name, email, password })
      navigate('/dashboard')
    } catch (err) {
      setApiError('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title="Create an account" subtitle="Start tracking your finances">
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="bg-[var(--expense-dim)] border border-[rgba(248,81,73,0.3)] rounded-lg px-3.5 py-2.5 text-[var(--expense)] text-sm">
            {apiError}
          </div>
        )}
        
        <Input
          label="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={validate}
          error={errors.name}
          placeholder="Jane Doe"
        />

        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={validate}
          error={errors.email}
          placeholder="you@example.com"
        />
        
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validate}
            error={errors.password}
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

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onBlur={validate}
            error={errors.confirmPassword}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute right-3 top-[26px] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
          Register
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)] mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--neutral)] hover:underline">
            Sign In →
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
