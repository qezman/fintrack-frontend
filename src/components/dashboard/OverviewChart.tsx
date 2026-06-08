import { useState, useMemo } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import type { Transaction } from '@/types'
import { groupByDate } from '@/utils/groupByDate'
import { formatCurrency } from '@/utils/formatCurrency'
import { formatDate } from '@/utils/formatDate'

type Period = '7D' | '30D' | '90D'

interface OverviewChartProps {
  transactions: Transaction[]
}

const formatYAxis = (value: number) => {
  if (value >= 1000) return `£${(value / 1000).toFixed(0)}k`
  return `£${value}`
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-[var(--bg-elevated)] border border-[var(--border-bright)] rounded-lg p-3 shadow-xl">
      <p className="text-[12px] text-[var(--text-secondary)] mb-2 font-mono">
        {label ? formatDate(label) : ''}
      </p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 font-mono text-[13px] mb-1 last:mb-0">
          <span style={{ color: entry.color }}>{entry.name === 'income' ? 'Income' : 'Expenses'}</span>
          <span className="text-[var(--text-primary)]">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export const OverviewChart = ({ transactions }: OverviewChartProps) => {
  const [period, setPeriod] = useState<Period>('30D')

  const data = useMemo(() => groupByDate(transactions, period), [transactions, period])

  return (
    <Card className="flex flex-col h-full col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cash Flow</h2>
        <div className="flex bg-[var(--bg-input)] rounded-lg p-1">
          {(['7D', '30D', '90D'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-[var(--neutral-dim)] text-[var(--neutral)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full h-[280px]">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm text-[var(--text-tertiary)]">
            No data for this period.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--income)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--income)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--expense)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--expense)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="date"
                tickFormatter={(val) => val.slice(8, 10) + '/' + val.slice(5, 7)}
                tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fill: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-mono)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="income"
                stroke="var(--income)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorIncome)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="var(--expense)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
      
      {/* Custom Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--income)] opacity-80" />
          <span className="text-sm text-[var(--text-secondary)]">Income</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--expense)] opacity-80" />
          <span className="text-sm text-[var(--text-secondary)]">Expenses</span>
        </div>
      </div>
    </Card>
  )
}
