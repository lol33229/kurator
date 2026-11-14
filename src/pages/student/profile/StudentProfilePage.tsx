import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import { PROFILE } from './profileData'
import {
  AvailabilitySection,
  GoalsSection,
  HistorySection,
  PersonalSection,
  ReviewsSection,
  SkillsSection,
} from './ProfileSections'
import styles from './StudentProfilePage.module.css'

// Профиль менти
export function StudentProfilePage() {
  return (
    <div className={`${landingStyles.page} ${styles.page}`}>
      <UserHeader
        name={PROFILE.shortName}
        roleLabel="менти"
        avatar={PROFILE.headerAvatar}
        profilePath="/student/profile"
        hiddenLinks={['/mentors']}
      />
      <main className={styles.main}>
        <h1 className={styles.title}>Мой профиль</h1>
        <p className={styles.subtitle}>Здесь вы можете управлять своими данными и целями</p>
        <div className={styles.sections}>
          <PersonalSection />
          <SkillsSection />
          <GoalsSection />
          <AvailabilitySection />
          <HistorySection />
          <ReviewsSection />
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
