import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { commitmentSchema } from '@/lib/validations/commitment'

const COMMITMENT_SELECT = `
  *,
  project:projects(*),
  author:profiles!commitments_author_id_fkey(*),
  responsible_executor:profiles!commitments_responsible_executor_id_fkey(*),
  responsible_checker:profiles!commitments_responsible_checker_id_fkey(*)
`

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = request.nextUrl
  const project_id = searchParams.get('project_id')
  const checker_id = searchParams.get('checker_id')

  let query = supabase
    .from('commitments')
    .select(COMMITMENT_SELECT)
    .order('created_at', { ascending: false })

  if (project_id) query = query.eq('project_id', project_id)
  if (checker_id) query = query.eq('responsible_checker_id', checker_id)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const now = new Date().toISOString()
  const result = (data ?? []).map(c => ({
    ...c,
    status: c.status === 'to_check' && c.deadline && c.deadline < now
      ? 'expired' as const
      : c.status,
  }))

  return NextResponse.json(result)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = commitmentSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('commitments')
    .insert({ ...parsed.data, author_id: user.id })
    .select(COMMITMENT_SELECT)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
