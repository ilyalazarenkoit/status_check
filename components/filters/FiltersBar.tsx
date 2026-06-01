'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Project, Profile, CommitmentFilters } from '@/types'

interface Props {
  projects: Project[]
  checkers: Profile[]
  filters: CommitmentFilters
  onFilterChange: (filters: CommitmentFilters) => void
}

const triggerClass = "bg-card border-border text-foreground text-sm rounded-sm focus:ring-0 focus:border-primary h-auto py-2 px-3 min-w-[160px]"
const contentClass = "bg-card border border-border text-foreground"
const itemClass = "text-foreground focus:bg-secondary focus:text-foreground cursor-pointer"

export default function FiltersBar({ projects, checkers, filters, onFilterChange }: Props) {
  const hasFilters = !!(filters.project_id || filters.checker_id)

  return (
    <div className="flex items-center gap-3 px-4 sm:px-6 py-3 border-b border-border flex-wrap">
      <Select
        value={filters.project_id ?? 'none'}
        onValueChange={v => onFilterChange({ ...filters, project_id: v === 'none' ? undefined : v })}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="All Projects" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="none" className={`${itemClass} text-muted-foreground`}>All Projects</SelectItem>
          {projects.map(p => (
            <SelectItem key={p.id} value={p.id} className={itemClass}>{p.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.checker_id ?? 'none'}
        onValueChange={v => onFilterChange({ ...filters, checker_id: v === 'none' ? undefined : v })}
      >
        <SelectTrigger className={triggerClass}>
          <SelectValue placeholder="All Checkers" />
        </SelectTrigger>
        <SelectContent className={contentClass}>
          <SelectItem value="none" className={`${itemClass} text-muted-foreground`}>All Checkers</SelectItem>
          {checkers.map(p => (
            <SelectItem key={p.id} value={p.id} className={itemClass}>{p.full_name ?? p.email}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <button
          onClick={() => onFilterChange({})}
          className="text-muted-foreground text-xs hover:text-foreground transition-colors duration-150 cursor-pointer"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
