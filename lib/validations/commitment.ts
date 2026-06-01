import { z } from 'zod'

export const commitmentSchema = z.object({
  title: z.string().min(1, 'Required'),
  description: z.string().optional().nullable(),
  status: z.enum(['to_check', 'expired', 'done', 'not_actual', 'ideas_backlog']).default('to_check'),
  project_id: z.string().uuid().optional().nullable(),
  responsible_executor_id: z.string().uuid().optional().nullable(),
  responsible_checker_id: z.string().uuid().optional().nullable(),
  deadline: z.string().optional().nullable(),
})
