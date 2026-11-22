import { AvailabilitySection, PersonalSection, SkillsSection } from '@/pages/profile/EditableSections'
import { HistorySection, ProfileLayout, ReviewsSection } from '@/pages/profile/ProfileParts'
import { GoalsSection } from './GoalsSection'
import { AVAILABILITY, HISTORY, PROFILE, REVIEWS, SKILLS } from './profileData'
import styles from './StudentProfile.module.css'

// Профиль менти
export function StudentProfilePage() {
  return (
    <ProfileLayout
      user={{ name: PROFILE.shortName, roleLabel: 'менти', avatar: PROFILE.headerAvatar }}
      profilePath="/student/profile"
      subtitle="Здесь вы можете управлять своими данными и целями"
      className={styles.page}
    >
      <PersonalSection subtitle="Основная информация о вас, которая видна наставникам" photo={PROFILE.photo} initial={PROFILE.personal} />
      <SkillsSection skills={SKILLS} />
      <GoalsSection />
      <AvailabilitySection subtitle="Когда вам удобно взаимодействовать с наставником" initial={AVAILABILITY} />
      <HistorySection items={HISTORY} currentLabel="Текущий наставник" historyPath="/student/history" />
      <ReviewsSection subtitle="Отзывы от ваших наставников" reviews={REVIEWS} reviewsPath="/student/reviews" />
    </ProfileLayout>
  )
}
