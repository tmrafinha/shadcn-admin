import { ContentSection } from '../components/content-section'
import { CurriculumForm } from './curriculos-form'

export function SettingsCurriculum() {
  return (
    <ContentSection
      title="Currículos"
      desc="Centralize e gerencie as versões do seu currículo para usar nas candidaturas."
    >
      <CurriculumForm />
    </ContentSection>
  )
}