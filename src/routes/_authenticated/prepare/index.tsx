import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Prepare } from '@/features/prepare'

const appsPrepareSchema = z.object({
  type: z
    .enum(['all', 'connected', 'notConnected'])
    .optional()
    .catch(undefined),
  filter: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/prepare/')({
  validateSearch: appsPrepareSchema,
  component: Prepare,
})
