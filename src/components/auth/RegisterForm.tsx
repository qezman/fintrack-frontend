import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { AuthCard } from './AuthCard'

interface FieldErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Cannot reach the server — check your connection or backend.'
    const msg = err.response.data?.message as string | undefined
    return msg ?? `Server error (${err.response.status}). Please try again.`
  }
  return 'An unexpected error occurred. Please try again.'
}

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
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [apiError, setApiError] = useState<string | null>(null)

  const validateField = (field: keyof FieldErrors, value: string) => {
    const updated = { ...fieldErrors }

    if (field === 'name') {
      if (!value.trim()) updated.name = 'Name is required'
      else delete updated.name
    }
    if (field === 'email') {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) updated.email = 'Invalid email address'
      else delete updated.email
    }
    if (field === 'password') {
      if (value.length < 8) updated.password = 'Minimum 8 characters'
      else delete updated.password
      if (confirmPassword && value !== confirmPassword) updated.confirmPassword = 'Passwords do not match'
      else if (confirmPassword) delete updated.confirmPassword
    }
    if (field === 'confirmPassword') {
      if (value !== password) updated.confirmPassword = 'Passwords do not match'
      else delete updated.confirmPassword
    }

    setFieldErrors(updated)
  }

  const validateAll = (): boolean => {
    const errors: FieldErrors = {}
    if (!name.trim()) errors.name = 'Name is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Invalid email address'
    if (password.length < 8) errors.password = 'Minimum 8 characters'
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateAll()) return

    setIsLoading(true)
    setApiError(null)

    try {
      await register({ name, email, password })
      navigate('/dashboard')
    } catch (err) {
      setApiError(getErrorMessage(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthCard title="Create account" subtitle="Start tracking your finances today">
      <form onSubmit={handleSubmit} className="space-y-4">
        {apiError && (
          <div className="bg-[var(--expense-dim)] border border-[rgba(248,81,73,0.3)] rounded-lg px-3.5 py-2.5 text-[var(--expense)] text-sm leading-relaxed">
            {apiError}
          </div>
        )}

        <Input
          label="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={(e) => validateField('name', e.target.value)}
          error={fieldErrors.name}
          placeholder="Jane Doe"
          autoComplete="name"
        />

        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) => validateField('email', e.target.value)}
          error={fieldErrors.email}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={(e) => validateField('password', e.target.value)}
          error={fieldErrors.password}
          placeholder="Min. 8 characters"
          autoComplete="new-password"
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

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={(e) => validateField('confirmPassword', e.target.value)}
          error={fieldErrors.confirmPassword}
          placeholder="Repeat password"
          autoComplete="new-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="hover:text-[var(--text-secondary)] transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>

        <p className="text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="text-[var(--neutral)] hover:underline font-medium">
            Sign in →
          </Link>
        </p>
      </form>
    </AuthCard>
  )
}
