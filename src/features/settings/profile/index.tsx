import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <ContentSection
      title="Perfil"
      desc="Essas são as informações que as empresas verão sobre você."
    >
      <ProfileForm />
    </ContentSection>
  )
}