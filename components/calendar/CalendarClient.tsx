'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import FiltersBar from '@/components/filters/FiltersBar'
import CommitmentModal from '@/components/commitments/CommitmentModal'
import type { Commitment, Project, Profile, CommitmentFilters } from '@/types'

function CalendarSpinner() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-[#3BFF6B]/30 border-t-[#3BFF6B] animate-spin" />
        <span className="text-xs text-muted-foreground">Loading calendar…</span>
      </div>
    </div>
  )
}

const CalendarView = dynamic(() => import('./CalendarView'), {
  ssr: false,
  loading: () => <CalendarSpinner />,
})

interface Props {
  initialCommitments: Commitment[]
  projects: Project[]
  profiles: Profile[]
  currentUserId: string
}

export default function CalendarClient({ initialCommitments, projects, profiles, currentUserId }: Props) {
  const [commitments, setCommitments] = useState<Commitment[]>(initialCommitments)
  const [filters, setFilters] = useState<CommitmentFilters>({})
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCommitment, setSelectedCommitment] = useState<Commitment | undefined>()
  const [defaultDeadline, setDefaultDeadline] = useState<string | undefined>()
  const [isRefetching, setIsRefetching] = useState(false)

  const fetchCommitments = useCallback(async (activeFilters: CommitmentFilters = {}) => {
    setIsRefetching(true)
    const params = new URLSearchParams()
    if (activeFilters.project_id) params.set('project_id', activeFilters.project_id)
    if (activeFilters.checker_id) params.set('checker_id', activeFilters.checker_id)
    const res = await fetch(`/api/commitments?${params.toString()}`)
    if (res.ok) setCommitments(await res.json())
    setIsRefetching(false)
  }, [])

  function handleFilterChange(newFilters: CommitmentFilters) {
    setFilters(newFilters)
    fetchCommitments(newFilters)
  }

  function handleEventClick(commitment: Commitment) {
    setSelectedCommitment(commitment)
    setDefaultDeadline(undefined)
    setModalOpen(true)
  }

  function handleDateClick(dateStr: string) {
    setSelectedCommitment(undefined)
    setDefaultDeadline(`${dateStr}T09:00`)
    setModalOpen(true)
  }

  function handleModalClose() {
    setModalOpen(false)
    setSelectedCommitment(undefined)
    setDefaultDeadline(undefined)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <FiltersBar
        projects={projects}
        checkers={profiles}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      <div className="flex-1 relative">
        {isRefetching && (
          <div className="absolute inset-0 z-10 flex items-start justify-center pt-16 bg-background/60 backdrop-blur-[2px]">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2 shadow-lg">
              <div className="w-4 h-4 rounded-full border-2 border-[#3BFF6B]/30 border-t-[#3BFF6B] animate-spin" />
              <span className="text-xs text-muted-foreground">Updating…</span>
            </div>
          </div>
        )}
        <CalendarView
          commitments={commitments}
          onEventClick={handleEventClick}
          onDateClick={handleDateClick}
        />
      </div>
      <CommitmentModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        commitment={selectedCommitment}
        defaultDeadline={defaultDeadline}
        projects={projects}
        profiles={profiles}
        currentUserId={currentUserId}
        onSuccess={() => fetchCommitments(filters)}
      />
    </div>
  )
}
