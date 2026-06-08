import { useState, useEffect, useCallback } from 'react'
import type { Toast, ToastVariant } from '@/types'

// Global state for toasts
let toastsMemory: Toast[] = []
let listeners: Array<() => void> = []

const emitChange = () => {
  listeners.forEach((l) => l())
}

const addToast = (message: string, variant: ToastVariant = 'info') => {
  const id = Math.random().toString(36).slice(2)
  const toast: Toast = { id, message, variant }
  toastsMemory = [...toastsMemory, toast]
  emitChange()
  
  setTimeout(() => {
    removeToast(id)
  }, 3500)
}

const removeToast = (id: string) => {
  toastsMemory = toastsMemory.filter((t) => t.id !== id)
  emitChange()
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>(toastsMemory)

  useEffect(() => {
    const listener = () => setToasts(toastsMemory)
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
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
