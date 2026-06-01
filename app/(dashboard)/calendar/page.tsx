import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CalendarClient from '@/components/calendar/CalendarClient'
import type { Commitment } from '@/types'

const COMMITMENT_SELECT = `
  *,
  project:projects(*),
  author:profiles!commitments_author_id_fkey(*),
  responsible_executor:profiles!commitments_responsible_executor_id_fkey(*),
  responsible_checker:profiles!commitments_responsible_checker_id_fkey(*)
`

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: rawCommitments }, { data: projects }, { data: profiles }] = await Promise.all([
    supabase.from('commitments').select(COMMITMENT_SELECT).order('created_at', { ascending: false }),
    supabase.from('projects').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('*').order('full_name', { ascending: true }),
  ])

  const now = new Date().toISOString()
  const commitments: Commitment[] = (rawCommitments ?? []).map(c => ({
    ...c,
    status: c.status === 'to_check' && c.deadline && c.deadline < now ? 'expired' : c.status,
  }))

  return (
    <CalendarClient
      initialCommitments={commitments}
      projects={projects ?? []}
      profiles={profiles ?? []}
      currentUserId={user.id}
    />
  )
}
