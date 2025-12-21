import { createFileRoute } from '@tanstack/react-router'
import { HelpCenter } from '@/components/help-center'

export const Route = createFileRoute('/_authenticated/help-center/')({
  component: HelpCenter,
})
