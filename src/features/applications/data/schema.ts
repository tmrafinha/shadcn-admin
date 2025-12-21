import { z } from 'zod'

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),

  company: z.string().optional(),
  companyLogoUrl: z.string().nullable().optional(), 
  location: z.string().optional(),
  model: z.string().optional(),
  type: z.string().optional(),
  level: z.string().optional(),
  salaryRange: z.string().optional(),
  source: z.string().optional(),
  appliedAt: z.date().optional(),
  lastUpdate: z.date().optional(),
})

export type Task = z.infer<typeof taskSchema>