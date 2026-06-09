import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { ButtonHTMLAttributes } from 'react'
import type { ButtonVariant } from '@/types'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]'

    const variants: Record<ButtonVariant, string> = {
      primary:
        'bg-gradient-to-r from-[#0ea5e9] to-[#6366f1] text-white shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_25px_rgba(14,165,233,0.5)] hover:brightness-110 border border-white/10',
      ghost:
        'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]',
      danger:
        'bg-[var(--expense-dim)] text-[var(--expense)] hover:bg-[rgba(244,63,94,0.25)] border border-[rgba(244,63,94,0.2)]',
      icon: 'w-10 h-10 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-input)]',
    }

    const paddingClass = variant === 'icon' ? '' : 'px-[18px] py-[10px]'

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], paddingClass, className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
