import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftAddon?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftAddon, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 font-mono text-[var(--text-secondary)] text-sm select-none">
              {leftAddon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              'w-full rounded-lg bg-[var(--bg-input)] border border-[var(--border)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] outline-none transition-all duration-150',
              'focus:border-[var(--neutral)] focus:shadow-[0_0_0_3px_rgba(88,166,255,0.15)]',
              error && 'border-[var(--expense)] focus:shadow-[0_0_0_3px_rgba(248,81,73,0.15)]',
              leftAddon && 'pl-8',
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[var(--expense)]">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
