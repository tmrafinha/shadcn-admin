import { createFileRoute } from '@tanstack/react-router'
import { Join } from '@/features/join'

export const Route = createFileRoute('/_public/join/')({
  component: Join,
})