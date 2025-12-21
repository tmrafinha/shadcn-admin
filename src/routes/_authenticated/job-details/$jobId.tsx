// src/routes/_authenticated/job-details/$jobId.tsx (ou .tsx equivalente)
import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { JobDetails } from '@/features/job-details'

const appsSearchSchema = z.object({
  type: z.enum(['all', 'connected', 'notConnected']).optional().catch(undefined),
  filter: z.string().optional().catch(''),
  sort: z.enum(['asc', 'desc']).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/job-details/$jobId')({
  validateSearch: appsSearchSchema,
  component: JobDetails,
})