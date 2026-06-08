import type { Transaction, ChartDataPoint } from '@/types'

type Period = '7D' | '30D' | '90D'

const PERIOD_DAYS: Record<Period, number> = { '7D': 7, '30D': 30, '90D': 90 }

export const groupByDate = (transactions: Transaction[], period: Period): ChartDataPoint[] => {
  const days = PERIOD_DAYS[period]
  const now = new Date()
  const cutoff = new Date(now)
  cutoff.setDate(now.getDate() - days)

  const filtered = transactions.filter((t) => new Date(t.date) >= cutoff)

  const map = new Map<string, ChartDataPoint>()

  filtered.forEach((t) => {
    const day = t.date.slice(0, 10)
    const existing = map.get(day) ?? { date: day, income: 0, expenses: 0 }
    if (t.type === 'income') {
      existing.income += t.amount
    } else {
      existing.expenses += t.amount
    }
    map.set(day, existing)
  })

  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date))
}
