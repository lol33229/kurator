import calendarIcon from '@/assets/icons/calendar-small.svg'
import clockIcon from '@/assets/icons/clock.svg'
import videoIcon from '@/assets/icons/video.svg'
import {
  AvailabilitySection,
  HistorySection,
  PersonalSection,
  ProfileLayout,
  ReviewsSection,
  SkillsSection,
} from '@/pages/profile/ProfileParts'
import { GoalsSection } from './GoalsSection'
import { AVAILABILITY, HISTORY, PROFILE, REVIEWS, SKILLS } from './profileData'
import styles from './StudentProfile.module.css'

const EDIT_PATH = '/student/profile/edit'

// Профиль менти
export function StudentProfilePage() {
  return (
    <ProfileLayout
      user={{ name: PROFILE.shortName, roleLabel: 'менти', avatar: PROFILE.headerAvatar }}
      profilePath="/student/profile"
      subtitle="Здесь вы можете управлять своими данными и целями"
      className={styles.page}
    >
      <PersonalSection
        subtitle="Основная информация о вас, которая видна наставникам"
        photo={PROFILE.photo}
        fields={PROFILE.fields}
        editPath={EDIT_PATH}
      />
      <SkillsSection skills={SKILLS} editPath={EDIT_PATH} />
      <GoalsSection />
      <AvailabilitySection
        subtitle="Когда вам удобно взаимодействовать с наставником"
        rows={[
          { icon: calendarIcon, label: 'Дни', value: AVAILABILITY.days },
          { icon: clockIcon, label: 'Время', value: AVAILABILITY.time },
          { icon: videoIcon, label: 'Формат', value: AVAILABILITY.format },
        ]}
        editPath={EDIT_PATH}
      />
      <HistorySection items={HISTORY} currentLabel="Текущий наставник" historyPath="/student/history" />
      <ReviewsSection subtitle="Отзывы от ваших наставников" reviews={REVIEWS} reviewsPath="/student/reviews" />
    </ProfileLayout>
  )
}
