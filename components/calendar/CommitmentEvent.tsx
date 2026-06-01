import type { CommitmentStatus } from '@/types'

interface Props {
  title: string
  status: CommitmentStatus
}

export default function CommitmentEvent({ title }: Props) {
  return (
    <div className="px-1 py-0.5 w-full overflow-hidden">
      <span className="text-white text-[0.7rem] leading-tight truncate block">{title}</span>
    </div>
  )
}
