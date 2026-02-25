import { createFileRoute } from '@tanstack/react-router'
import { PublicJobs } from '@/features/public-jobs'

export const Route = createFileRoute('/_public/public-jobs/')({
  component: PublicJobs,
})