import { createFileRoute } from '@tanstack/react-router'
import { SettingsCurriculum } from '@/features/settings/curriculum'

export const Route = createFileRoute('/_authenticated/settings/curriculum')({
  component: SettingsCurriculum,
})
