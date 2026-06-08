import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { CATEGORY_COLORS } from '@/constants/categories'
import { formatCurrency } from '@/utils/formatCurrency'
import type { Transaction, Category } from '@/types'

interface CategoryBreakdownProps {
  transactions: Transaction[]
}

interface ChartData {
  name: Category
  value: number
  color: string
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload as ChartData
  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-bright)] rounded-lg p-3 shadow-xl flex items-center gap-3">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
      <span className="text-sm font-medium text-[var(--text-primary)]">{data.name}</span>
      <span className="font-mono text-sm text-[var(--text-secondary)]">
        {formatCurrency(data.value)}
      </span>
    </div>
  )
}

export const CategoryBreakdown = ({ transactions }: CategoryBreakdownProps) => {
  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount
      return acc
    }, {} as Record<string, number>)

    const total = expenses.reduce((sum, t) => sum + t.amount, 0)

    return Object.entries(grouped)
      .map(([name, value]) => ({
        name: name as Category,
        value,
        color: CATEGORY_COLORS[name as Category] || '#8b949e',
        percentage: total > 0 ? (value / total) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  return (
    <Card className="flex flex-col h-full col-span-1 lg:col-span-1">
      <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Expenses by Category</h2>

      <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-8">
        {data.length === 0 ? (
          <EmptyState
            icon="inbox"
            message="No expense data yet"
            description="Record an expense to see the breakdown."
          />
        ) : (
          <>
            <div className="w-[200px] h-[200px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="var(--bg-surface)"
                    strokeWidth={2}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full space-y-3">
              {data.map((item) => (
                <div key={item.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[var(--text-tertiary)] w-9 text-right">
                      {item.percentage.toFixed(0)}%
                    </span>
                    <span className="font-mono text-sm text-[var(--text-primary)]">
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  )
}
