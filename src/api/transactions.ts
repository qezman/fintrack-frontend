import { api } from './axios'
import type { Transaction, CreateTransactionPayload, Summary } from '@/types'

export const getTransactions = (): Promise<Transaction[]> =>
  api.get<Transaction[]>('/transactions').then((r) => r.data)

export const createTransaction = (
  payload: CreateTransactionPayload
): Promise<Transaction> =>
  api.post<Transaction>('/transactions', payload).then((r) => r.data)

export const deleteTransaction = (id: string): Promise<void> =>
  api.delete(`/transactions/${id}`).then(() => undefined)

export const getSummary = (): Promise<Summary> =>
  api.get<Summary>('/transactions/summary').then((r) => r.data)
