'use client'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { Commitment, CommitmentStatus } from '@/types'
import CommitmentEvent from './CommitmentEvent'

const STATUS_COLORS: Record<CommitmentStatus, string> = {
  to_check:      '#3B82F6',
  expired:       '#EF4444',
  done:          '#3BFF6B',
  not_actual:    '#6B7280',
  ideas_backlog: '#A855F7',
}

interface Props {
  commitments: Commitment[]
  onEventClick: (commitment: Commitment) => void
  onDateClick: (dateStr: string) => void
}

export default function CalendarView({ commitments, onEventClick, onDateClick }: Props) {
  const events = commitments
    .filter(c => c.deadline)
    .map(c => ({
      id: c.id,
      title: c.title,
      start: c.deadline!,
      backgroundColor: STATUS_COLORS[c.status],
      borderColor: 'transparent',
      extendedProps: { commitment: c },
    }))

  return (
    <div className="p-4 sm:p-6">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek',
        }}
        events={events}
        eventClick={arg => onEventClick(arg.event.extendedProps.commitment as Commitment)}
        dateClick={arg => onDateClick(arg.dateStr)}
        eventContent={info => (
          <CommitmentEvent
            title={info.event.title}
            status={(info.event.extendedProps.commitment as Commitment).status}
          />
        )}
        height="auto"
        eventDisplay="block"
        dayMaxEvents={3}
      />
    </div>
  )
}
