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
  full_name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  confirm_password: z.string(),
}).refine(d => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path: ['confirm_password'],
})

type FormData = z.infer<typeof schema>

export default function RegisterForm() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ full_name, email, password }: FormData) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name } },
    })
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
        <p className="text-sm text-muted-foreground mt-1">Create your account</p>
      </div>

      <div className="bg-card border border-border rounded-md p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full name</Label>
            <Input
              {...register('full_name')}
              placeholder="John Doe"
              className="bg-background border-border focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary"
            />
            {errors.full_name && <p className="text-xs text-red-400">{errors.full_name.message}</p>}
          </div>

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

          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Confirm password</Label>
            <Input
              {...register('confirm_password')}
              type="password"
              placeholder="••••••••"
              className="bg-background border-border focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary"
            />
            {errors.confirm_password && <p className="text-xs text-red-400">{errors.confirm_password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3BFF6B] text-[#0A0A0A] font-semibold rounded-sm hover:bg-[#2DE85E] active:scale-[0.98] transition-all cursor-pointer"
          >
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-[#3BFF6B] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
