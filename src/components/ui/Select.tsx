import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'

interface SelectProps {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  id?: string
  disabled?: boolean
}

export const Select = ({
  label,
  error,
  options,
  placeholder,
  value,
  onValueChange,
  className,
  id,
  disabled,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder ?? 'Select...'
  const hasValue = !!value

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (optValue: string) => {
    onValueChange?.(optValue)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          id={id}
          disabled={disabled}
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            'w-full flex items-center justify-between rounded-lg bg-[var(--bg-input)] border border-[var(--border)] px-3.5 py-2.5 text-sm outline-none transition-all duration-150 cursor-pointer text-left',
            isOpen && 'border-[var(--neutral)] shadow-[0_0_0_3px_rgba(88,166,255,0.15)]',
            !isOpen && 'hover:border-[var(--border-bright)]',
            error && 'border-[var(--expense)] shadow-[0_0_0_3px_rgba(248,81,73,0.12)]',
            disabled && 'opacity-50 cursor-not-allowed',
            hasValue ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]',
            className
          )}
        >
          <span>{selectedLabel}</span>
          <ChevronDown
            size={15}
            className={cn(
              'text-[var(--text-secondary)] transition-transform duration-200 shrink-0 ml-2',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && (
          <div className="absolute z-20 w-full mt-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-bright)] shadow-2xl overflow-hidden">
            <div className="max-h-52 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    'w-full px-3.5 py-2.5 text-left text-sm transition-colors',
                    opt.value === value
                      ? 'bg-[var(--neutral-dim)] text-[var(--neutral)] font-medium'
                      : 'text-[var(--text-primary)] hover:bg-[var(--bg-input)]'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-[var(--expense)]">{error}</p>}
    </div>
  )
}
