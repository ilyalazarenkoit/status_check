import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/auth/LogoutButton'
import ThemeToggle from '@/components/ThemeToggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="h-14 border-b border-border flex items-center justify-between px-6 bg-background flex-shrink-0">
        <span className="text-foreground font-bold tracking-tight text-sm">Status Check</span>
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-xs">{profile?.full_name ?? user.email}</span>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
