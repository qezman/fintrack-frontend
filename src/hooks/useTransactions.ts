import { useState, useEffect, useCallback } from 'react'
import type { Transaction, CreateTransactionPayload } from '@/types'
import {
  getTransactions,
  createTransaction as createTxnApi,
  deleteTransaction as deleteTxnApi,
} from '@/api/transactions'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getTransactions()
      setTransactions(data)
    } catch {
      setError('Failed to load transactions')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTransactions()
  }, [fetchTransactions])

  const createTransaction = useCallback(
    async (payload: CreateTransactionPayload): Promise<Transaction> => {
      const txn = await createTxnApi(payload)
      setTransactions((prev) => [txn, ...prev])
      return txn
    },
    []
  )

  const deleteTransaction = useCallback(async (id: string): Promise<void> => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTxnApi(id)
    } catch {
      await fetchTransactions()
      throw new Error('Failed to delete transaction')
    }
  }, [fetchTransactions])

  return { transactions, isLoading, error, fetchTransactions, createTransaction, deleteTransaction }
}
