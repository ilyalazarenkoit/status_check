'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { commitmentSchema } from '@/lib/validations/commitment'
import type { z } from 'zod'
import type { Commitment, Project, Profile } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

type FormValues = z.infer<typeof commitmentSchema>

const STATUS_OPTIONS = [
  { value: 'to_check',      label: 'To Check' },
  { value: 'expired',       label: 'Expired' },
  { value: 'done',          label: 'Done' },
  { value: 'not_actual',    label: 'Not Actual' },
  { value: 'ideas_backlog', label: 'Ideas Backlog' },
] as const

const inputClass = "w-full bg-card border border-border rounded-sm text-foreground text-sm px-3 py-2.5 outline-none placeholder:text-muted-foreground focus:border-primary transition-colors duration-150"
const labelClass = "block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5"
const selectTriggerClass = "bg-card border-border text-foreground text-sm rounded-sm focus:ring-0 focus:border-primary h-auto py-2.5 px-3"
const selectContentClass = "bg-card border border-border text-foreground"
const selectItemClass = "text-foreground focus:bg-secondary focus:text-foreground cursor-pointer"

interface Props {
  commitment?: Commitment
  defaultDeadline?: string
  projects: Project[]
  profiles: Profile[]
  onSuccess: () => void
  onCancel: () => void
}

export default function CommitmentForm({ commitment, defaultDeadline, projects, profiles, onSuccess, onCancel }: Props) {
  const isEdit = !!commitment

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(commitmentSchema),
    defaultValues: {
      title: commitment?.title ?? '',
      description: commitment?.description ?? '',
      status: commitment?.status ?? 'to_check',
      project_id: commitment?.project_id ?? null,
      responsible_executor_id: commitment?.responsible_executor_id ?? null,
      responsible_checker_id: commitment?.responsible_checker_id ?? null,
      deadline: commitment?.deadline
        ? new Date(commitment.deadline).toISOString().slice(0, 16)
        : defaultDeadline ?? '',
    },
  })

  async function onSubmit(values: FormValues) {
    try {
      const payload = {
        ...values,
        project_id: values.project_id || null,
        responsible_executor_id: values.responsible_executor_id || null,
        responsible_checker_id: values.responsible_checker_id || null,
        deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
      }

      const url = isEdit ? `/api/commitments/${commitment!.id}` : '/api/commitments'
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.status === 403) {
        toast.error('You can only edit your own commitments')
        return
      }
      if (!res.ok) {
        toast.error('Something went wrong')
        return
      }

      toast.success(isEdit ? 'Commitment updated' : 'Commitment created')
      onSuccess()
    } catch (e) {
      toast.error('Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Title */}
      <div>
        <label className={labelClass}>Title</label>
        <input {...register('title')} className={inputClass} placeholder="What needs to be done?" />
        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div>
        <label className={labelClass}>Description</label>
        <textarea {...register('description')} rows={2} className={`${inputClass} resize-none`} placeholder="Optional details" />
      </div>

      {/* Status + Project */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Status</label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {STATUS_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value} className={selectItemClass}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <label className={labelClass}>Project</label>
          <Controller
            control={control}
            name="project_id"
            render={({ field }) => (
              <Select value={field.value ?? 'none'} onValueChange={v => field.onChange(v === 'none' ? null : v)}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="No project" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="none" className={`${selectItemClass} text-muted-foreground`}>No project</SelectItem>
                  {projects.map(p => (
                    <SelectItem key={p.id} value={p.id} className={selectItemClass}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Executor + Checker */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Executor</label>
          <Controller
            control={control}
            name="responsible_executor_id"
            render={({ field }) => (
              <Select value={field.value ?? 'none'} onValueChange={v => field.onChange(v === 'none' ? null : v)}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="none" className={`${selectItemClass} text-muted-foreground`}>Unassigned</SelectItem>
                  {profiles.map(p => (
                    <SelectItem key={p.id} value={p.id} className={selectItemClass}>{p.full_name ?? p.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div>
          <label className={labelClass}>Checker</label>
          <Controller
            control={control}
            name="responsible_checker_id"
            render={({ field }) => (
              <Select value={field.value ?? 'none'} onValueChange={v => field.onChange(v === 'none' ? null : v)}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  <SelectItem value="none" className={`${selectItemClass} text-muted-foreground`}>Unassigned</SelectItem>
                  {profiles.map(p => (
                    <SelectItem key={p.id} value={p.id} className={selectItemClass}>{p.full_name ?? p.email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label className={labelClass}>Deadline</label>
        <input
          {...register('deadline')}
          type="datetime-local"
          className={`${inputClass} [color-scheme:dark]`}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        <button
          type="button"
          onClick={onCancel}
          className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-150 cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#3BFF6B] text-[#0A0A0A] text-sm font-semibold px-4 py-2 rounded-sm hover:bg-[#2DE85E] active:scale-[0.98] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create'}
        </button>
      </div>
    </form>
  )
}
