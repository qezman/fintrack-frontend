import { useState } from 'react'
import { Upload, X, File as FileIcon } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useTransactions } from '@/hooks/useTransactions'
import { useToast } from '@/hooks/useToast'
import { uploadReceipt } from '@/api/uploads'
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from '@/constants/categories'
import type { TransactionType, Category, CreateTransactionPayload } from '@/types'

interface TransactionFormProps {
  onSuccess?: () => void
}

export const TransactionForm = ({ onSuccess }: TransactionFormProps) => {
  const { createTransaction } = useTransactions()
  const { showToast } = useToast()

  const [type, setType] = useState<TransactionType>('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<Category>('Food & Drink')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')
  const [file, setFile] = useState<File | null>(null)
  
  const [isLoading, setIsLoading] = useState(false)

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType)
    setCategory(newType === 'income' ? 'Salary' : 'Food & Drink')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      if (selected.size > 5 * 1024 * 1024) {
        showToast('File must be less than 5MB', 'error')
        return
      }
      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selected.type)) {
        showToast('Only JPG, PNG, and PDF allowed', 'error')
        return
      }
      setFile(selected)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      showToast('Please enter a valid amount', 'error')
      return
    }

    setIsLoading(true)
    try {
      let receiptKey: string | undefined
      
      if (file) {
        receiptKey = await uploadReceipt(file)
      }

      const payload: CreateTransactionPayload = {
        type,
        amount: Number(amount),
        category,
        date,
        note: note || undefined,
        receiptKey,
      }

      await createTransaction(payload)
      showToast('Transaction added successfully', 'success')
      onSuccess?.()
    } catch (err) {
      showToast('Failed to save transaction', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  return (
    <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5">
      {/* Type Toggle */}
      <div className="flex bg-[var(--bg-input)] p-1 rounded-lg">
        {(['expense', 'income'] as TransactionType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
              type === t
                ? t === 'income'
                  ? 'bg-[var(--income-dim)] text-[var(--income)]'
                  : 'bg-[var(--expense-dim)] text-[var(--expense)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          leftAddon="£"
        />
        <Input
          label="Date"
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <Select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        options={categories.map((c) => ({ value: c, label: c }))}
      />

      <Input
        label="Note (Optional)"
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="e.g. Weekly groceries"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)]">
          Receipt (Optional)
        </label>
        
        {!file ? (
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[var(--border)] rounded-lg bg-[var(--bg-input)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-bright)] transition-colors cursor-pointer group">
            <Upload className="w-6 h-6 mb-2 text-[var(--text-tertiary)] group-hover:text-[var(--neutral)] transition-colors" />
            <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
              Click to upload JPG, PNG, or PDF
            </span>
            <input type="file" className="hidden" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
          </label>
        ) : (
          <div className="flex items-center justify-between p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-input)]">
            <div className="flex items-center gap-3 overflow-hidden">
              <FileIcon className="w-5 h-5 text-[var(--neutral)] shrink-0" />
              <span className="text-sm text-[var(--text-primary)] truncate">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-[var(--text-tertiary)] hover:text-[var(--expense)] transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
        Save Transaction
      </Button>
    </form>
  )
}
