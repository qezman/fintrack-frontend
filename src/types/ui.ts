export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'icon'
export type BadgeVariant = 'income' | 'expense' | 'neutral'
export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
}

export interface SelectOption {
  value: string
  label: string
}
