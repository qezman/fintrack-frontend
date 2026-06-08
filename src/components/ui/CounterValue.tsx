import { useEffect, useRef, useState } from 'react'
import { formatCurrency } from '@/utils/formatCurrency'

interface CounterValueProps {
  value: number
  duration?: number
  className?: string
}

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

export const CounterValue = ({ value, duration = 1000, className }: CounterValueProps) => {
  const [displayed, setDisplayed] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    startRef.current = null
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      setDisplayed(easeOutQuart(progress) * value)
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [value, duration])

  return <span className={className}>{formatCurrency(displayed)}</span>
}
