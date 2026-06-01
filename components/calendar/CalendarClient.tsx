'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import FiltersBar from '@/components/filters/FiltersBar'
import CommitmentModal from '@/components/commitments/CommitmentModal'
import type { Commitment, Project, Profile, CommitmentFilters } from '@/types'

const CalendarView = dynamic(() => import('./CalendarView'), { ssr: false })

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

  const fetchCommitments = useCallback(async (activeFilters: CommitmentFilters = {}) => {
    const params = new URLSearchParams()
    if (activeFilters.project_id) params.set('project_id', activeFilters.project_id)
    if (activeFilters.checker_id) params.set('checker_id', activeFilters.checker_id)
    const res = await fetch(`/api/commitments?${params.toString()}`)
    if (res.ok) setCommitments(await res.json())
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
      <div className="flex-1">
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
