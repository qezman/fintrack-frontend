import { useState, useEffect, useCallback } from 'react'
import type { Summary } from '@/types'
import { getSummary } from '@/api/transactions'

export const useSummary = () => {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSummary = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getSummary()
      setSummary(data)
    } catch {
      setError('Failed to load summary')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSummary()
  }, [fetchSummary])

  return { summary, isLoading, error, fetchSummary }
}
