import { useState, useEffect, useCallback } from 'react'
import type { Toast, ToastVariant } from '@/types'

let globalToasts: Toast[] = []
let globalListeners: ((toasts: Toast[]) => void)[] = []

const emitChange = () => {
  globalListeners.forEach((l) => l(globalToasts))
}

const addToast = (message: string, variant: ToastVariant = 'info') => {
  const id = Math.random().toString(36).slice(2)
  const toast: Toast = { id, message, variant }
  globalToasts = [...globalToasts, toast]
  emitChange()
  
  setTimeout(() => {
    removeToast(id)
  }, 3500)
}

const removeToast = (id: string) => {
  globalToasts = globalToasts.filter((t) => t.id !== id)
  emitChange()
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(globalToasts)

  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToasts(newToasts)
    globalListeners.push(listener)
    return () => {
      globalListeners = globalListeners.filter((l) => l !== listener)
    }
  }, [])

  const showToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    addToast(message, variant)
  }, [])

  const dismissToast = useCallback((id: string) => {
    removeToast(id)
  }, [])

  return { toasts, showToast, dismissToast }
}
