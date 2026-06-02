'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(data)
    if (error) {
      toast.error(error.message)
      return
    }
    router.push('/calendar')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Status Check</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to your account</p>
      </div>

      <div className="bg-card border border-border rounded-md p-6 space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
            <Input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="bg-background border-border focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary"
            />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
            <Input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="bg-background border-border focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary"
            />
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3BFF6B] text-[#0A0A0A] font-semibold rounded-sm hover:bg-[#2DE85E] active:scale-[0.98] transition-all cursor-pointer"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        No account?{' '}
        <Link href="/register" className="text-[#3BFF6B] hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
