import calendarIcon from '@/assets/icons/calendar-small.svg'
import clockIcon from '@/assets/icons/clock.svg'
import rubleIcon from '@/assets/icons/ruble.svg'
import videoIcon from '@/assets/icons/video.svg'
import {
  AvailabilitySection,
  HistorySection,
  PersonalSection,
  ProfileLayout,
  ReviewsSection,
  SkillsSection,
} from '@/pages/profile/ProfileParts'
import { AVAILABILITY, HISTORY, PROFILE, REVIEWS, SKILLS } from './mentorProfileData'
import { ExperienceSection, MentorshipSection } from './MentorProfileSections'
import styles from './MentorProfile.module.css'

const EDIT_PATH = '/mentor/profile/edit'

// Профиль ментора
export function MentorProfilePage() {
  return (
    <ProfileLayout
      user={{ name: PROFILE.shortName, roleLabel: 'ментор', avatar: PROFILE.headerAvatar }}
      profilePath="/mentor/profile"
      subtitle="Здесь вы можете управлять своими данными и наставничеством"
      className={styles.page}
    >
      <PersonalSection
        subtitle="Основная информация о вас, которая видна менти"
        photo={PROFILE.photo}
        fields={PROFILE.fields}
        editPath={EDIT_PATH}
      />
      <SkillsSection skills={SKILLS} editPath={EDIT_PATH} />
      <ExperienceSection editPath={EDIT_PATH} />
      <AvailabilitySection
        subtitle="Когда вам удобно взаимодействовать с менти"
        rows={[
          { icon: calendarIcon, label: 'Дни', value: AVAILABILITY.days },
          { icon: clockIcon, label: 'Время', value: AVAILABILITY.time },
          { icon: videoIcon, label: 'Формат', value: AVAILABILITY.format },
          { icon: rubleIcon, label: 'Модель стоимости и цена', value: AVAILABILITY.price },
        ]}
        editPath={EDIT_PATH}
      />
      <MentorshipSection editPath={EDIT_PATH} />
      <HistorySection items={HISTORY} currentLabel="Текущий менти" historyPath="/mentor/history" />
      <ReviewsSection subtitle="Отзывы от ваших менти" reviews={REVIEWS} reviewsPath="/mentor/reviews" />
    </ProfileLayout>
  )
}
