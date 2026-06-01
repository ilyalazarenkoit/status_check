import type { Database } from '@/lib/database.types'

// Базовые row/insert/update типы — источник истины: схема БД
export type CommitmentRow    = Database['public']['Tables']['commitments']['Row']
export type CommitmentInsert = Database['public']['Tables']['commitments']['Insert']
export type CommitmentUpdate = Database['public']['Tables']['commitments']['Update']
export type Profile          = Database['public']['Tables']['profiles']['Row']
export type Project          = Database['public']['Tables']['projects']['Row']
export type ProjectInsert    = Database['public']['Tables']['projects']['Insert']

// Enum из схемы БД
export type CommitmentStatus = Database['public']['Enums']['commitment_status']

// Joined тип для UI — БД джойны не знает, это наша логика
export type Commitment = CommitmentRow & {
  project?: Project
  author?: Profile
  responsible_executor?: Profile
  responsible_checker?: Profile
}

// Тип для формы — Insert без автогенерируемых полей
export type CommitmentFormData = Omit<CommitmentInsert, 'id' | 'author_id' | 'created_at' | 'updated_at'>

// Тип фильтров для FiltersBar
export interface CommitmentFilters {
  project_id?: string
  checker_id?: string
}
