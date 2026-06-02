'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import CommitmentForm from './CommitmentForm'
import StatusBadge from './StatusBadge'
import type { Commitment, Project, Profile } from '@/types'
import { toast } from 'sonner'
import { format, formatDistanceToNow, isPast, isToday } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  commitment?: Commitment
  defaultDeadline?: string
  projects: Project[]
  profiles: Profile[]
  currentUserId: string
  onSuccess: () => void
}

export default function CommitmentModal({ isOpen, onClose, commitment, defaultDeadline, projects, profiles, currentUserId, onSuccess }: Props) {
  const canEdit = !commitment || commitment.author_id === currentUserId
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>(commitment ? 'view' : 'create')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setMode(commitment ? 'view' : 'create')
      setConfirmDelete(false)
    }
  }, [isOpen, commitment])

  function handleClose() {
    setConfirmDelete(false)
    onClose()
  }

  function handleSuccess() {
    handleClose()
    onSuccess()
  }

  async function handleDelete() {
    if (!commitment) return
    setDeleting(true)
    const res = await fetch(`/api/commitments/${commitment.id}`, { method: 'DELETE' })
    setDeleting(false)
    if (res.status === 403) {
      toast.error('You can only delete your own commitments')
      return
    }
    if (!res.ok) {
      toast.error('Failed to delete')
      return
    }
    toast.success('Commitment deleted')
    handleClose()
    onSuccess()
  }

  const title = mode === 'create' ? 'New Commitment' : 'Edit Commitment'

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="bg-card border border-border text-foreground sm:max-w-lg sm:rounded-lg sm:shadow-2xl sm:shadow-black/20 max-sm:fixed max-sm:inset-x-0 max-sm:bottom-0 max-sm:top-auto max-sm:left-0 max-sm:right-0 max-sm:w-full max-sm:max-w-full max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-t-2xl max-sm:rounded-b-none max-sm:max-h-[90vh] max-sm:overflow-y-auto max-sm:border-x-0 max-sm:border-b-0" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        <DialogHeader>
          {mode === 'view' && commitment ? (
            <div className="flex items-start gap-2 pr-6">
              <DialogTitle className="text-foreground font-bold text-lg tracking-tight leading-snug">
                {commitment.title}
              </DialogTitle>
              <div className="shrink-0 mt-0.5">
                <StatusBadge status={commitment.status} />
              </div>
            </div>
          ) : (
            <DialogTitle className="text-foreground font-bold text-lg tracking-tight">
              {title}
            </DialogTitle>
          )}
        </DialogHeader>

        {mode === 'view' && commitment ? (
          <div className="space-y-4 max-sm:pb-4">

            {commitment.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{commitment.description}</p>
            )}

            {commitment.deadline && (() => {
              const d = new Date(commitment.deadline)
              const active = commitment.status !== 'done' && commitment.status !== 'not_actual'
              const overdue = active && isPast(d) && !isToday(d)
              const dueToday = active && isToday(d)
              return (
                <div className={`flex items-center gap-2 text-sm ${overdue ? 'text-red-500' : dueToday ? 'text-orange-400' : 'text-foreground'}`}>
                  <CalendarIcon size={14} className="shrink-0" />
                  <span>{format(d, 'dd MMM yyyy, HH:mm')}</span>
                  <span className={`text-xs ${overdue ? 'text-red-400' : dueToday ? 'text-orange-400 font-medium' : 'text-muted-foreground'}`}>
                    {dueToday ? '· Due today' : `· ${formatDistanceToNow(d, { addSuffix: true })}`}
                  </span>
                </div>
              )
            })()}

            {commitment.project && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Project</p>
                <p className="text-foreground text-sm">{commitment.project.name}</p>
              </div>
            )}

            {(commitment.responsible_executor || commitment.responsible_checker) && (
              <div className="grid grid-cols-2 gap-3">
                {commitment.responsible_executor && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Executor</p>
                    <p className="text-foreground text-sm">{commitment.responsible_executor.full_name ?? commitment.responsible_executor.email}</p>
                  </div>
                )}
                {commitment.responsible_checker && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Checker</p>
                    <p className="text-foreground text-sm">{commitment.responsible_checker.full_name ?? commitment.responsible_checker.email}</p>
                  </div>
                )}
              </div>
            )}

            {canEdit && (
              <div className="flex items-center justify-between pt-2 border-t border-border">
                {confirmDelete ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">Delete this commitment?</span>
                    <button onClick={() => setConfirmDelete(false)} className="text-muted-foreground text-xs hover:text-foreground transition-colors cursor-pointer">
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-red-500 text-xs hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : 'Confirm delete'}
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmDelete(true)} className="text-red-500 text-sm hover:text-red-400 transition-colors duration-150 cursor-pointer">
                    Delete
                  </button>
                )}
                <button
                  onClick={() => setMode('edit')}
                  className="bg-[#3BFF6B] text-[#0A0A0A] text-sm font-semibold px-4 py-2 rounded-sm hover:bg-[#2DE85E] active:scale-[0.98] transition-all duration-150 cursor-pointer"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        ) : canEdit ? (
          <CommitmentForm
            commitment={mode === 'edit' ? commitment : undefined}
            defaultDeadline={defaultDeadline}
            projects={projects}
            profiles={profiles}
            onSuccess={handleSuccess}
            onCancel={mode === 'edit' ? () => setMode('view') : handleClose}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
