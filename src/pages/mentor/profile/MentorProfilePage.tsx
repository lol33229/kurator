import { AvailabilitySection, PersonalSection, SkillsSection } from '@/pages/profile/EditableSections'
import { HistorySection, ProfileLayout, ReviewsSection } from '@/pages/profile/ProfileParts'
import { AVAILABILITY, HISTORY, PROFILE, REVIEWS, SKILLS } from './mentorProfileData'
import { ExperienceSection, MentorshipSection } from './MentorProfileSections'
import styles from './MentorProfile.module.css'

// Профиль ментора
export function MentorProfilePage() {
  return (
    <ProfileLayout
      user={{ name: PROFILE.shortName, roleLabel: 'ментор', avatar: PROFILE.headerAvatar }}
      profilePath="/mentor/profile"
      subtitle="Здесь вы можете управлять своими данными и наставничеством"
      className={styles.page}
    >
      <PersonalSection subtitle="Основная информация о вас, которая видна менти" photo={PROFILE.photo} initial={PROFILE.personal} />
      <SkillsSection skills={SKILLS} />
      <ExperienceSection />
      <AvailabilitySection subtitle="Когда вам удобно взаимодействовать с менти" initial={AVAILABILITY} />
      <MentorshipSection />
      <HistorySection items={HISTORY} currentLabel="Текущий менти" historyPath="/mentor/history" />
      <ReviewsSection subtitle="Отзывы от ваших менти" reviews={REVIEWS} reviewsPath="/mentor/reviews" />
    </ProfileLayout>
  )
}
