
import type { CommitmentStatus } from '@/types'

const STATUS_CONFIG: Record<CommitmentStatus, { label: string; className: string }> = {
  to_check:      { label: 'To Check',      className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' },
  expired:       { label: 'Expired',       className: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30' },
  done:          { label: 'Done',          className: 'bg-[#3BFF6B]/15 text-[#16A34A] dark:text-[#3BFF6B] border-[#3BFF6B]/30' },
  not_actual:    { label: 'Not Actual',    className: 'bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border-neutral-500/30' },
  ideas_backlog: { label: 'Ideas Backlog', className: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30' },
}

export default function StatusBadge({ status }: { status: CommitmentStatus }) {
  const { label, className } = STATUS_CONFIG[status]
  return (
    
    <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-sm border ${className}`}>
      {label}
    </span>
  )
}
