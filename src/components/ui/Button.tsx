import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'
import type { ButtonVariant } from '@/types'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
  children: ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--neutral)] text-black font-semibold hover:opacity-90 active:opacity-80',
  ghost:
    'border border-[var(--border-bright)] text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
  danger:
    'bg-[var(--expense-dim)] text-[var(--expense)] border border-[rgba(248,81,73,0.3)] hover:bg-[rgba(248,81,73,0.2)]',
  icon:
    'w-9 h-9 flex items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
}

export const Button = ({
  variant = 'primary',
  isLoading = false,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg px-[18px] py-[10px] text-sm font-medium transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Saving...</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
