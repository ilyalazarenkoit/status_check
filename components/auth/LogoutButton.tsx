'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success('Signed out')
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs border border-[#2A2A2A] text-[#888] px-3 py-1.5 rounded-sm hover:border-[#3BFF6B] hover:text-[#3BFF6B] transition-all duration-150 cursor-pointer"
    >
      Logout
    </button>
  )
}
