import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import { MY_MENTORS, STUDENT } from './data'
import { EventsCard, FindMentorCard, GoalCard, MentorCard, RequestsCard } from './StudentCards'
import styles from './StudentHomePage.module.css'

// Главный экран менти
export function StudentHomePage() {
  const [firstMentor, secondMentor] = MY_MENTORS
  return (
    <div className={`${landingStyles.page} ${styles.page}`}>
      <UserHeader name={STUDENT.shortName} roleLabel="менти" avatar={STUDENT.avatar} profilePath="/student/profile" />
      <main className={styles.main}>
        <h1 className={styles.title}>Привет, {STUDENT.firstName}!</h1>
        <p className={styles.subtitle}>Ваш путь к новым знаниям и возможностям начинается здесь.</p>
        <div className={styles.grid}>
          <div className={styles.column}>
            {firstMentor && <MentorCard mentor={firstMentor} />}
            <RequestsCard />
            <FindMentorCard />
          </div>
          <div className={styles.column}>
            {secondMentor && <MentorCard mentor={secondMentor} />}
            <EventsCard />
            <GoalCard />
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
