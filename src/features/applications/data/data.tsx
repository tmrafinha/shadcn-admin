import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
} from 'lucide-react'

export const labels = [
  {
    value: 'application',
    label: 'Candidatura',
  },
]

export const statuses = [
  {
    label: 'Candidatado',
    value: 'candidatado' as const,
    icon: Circle,
  },
  {
    label: 'Em análise',
    value: 'em_analise' as const,
    icon: Timer,
  },
  {
    label: 'Entrevista',
    value: 'entrevista' as const,
    icon: HelpCircle,
  },
  {
    label: 'Oferta',
    value: 'oferta' as const,
    icon: CheckCircle,
  },
  {
    label: 'Reprovado',
    value: 'reprovado' as const,
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: 'Low',
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: 'Medium',
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: 'High',
    value: 'high' as const,
    icon: ArrowUp,
  },
  {
    label: 'Critical',
    value: 'critical' as const,
    icon: AlertCircle,
  },
]