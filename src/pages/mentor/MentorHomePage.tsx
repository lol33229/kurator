import { useState } from 'react'
import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import { MENTOR, REQUESTS } from './data'
import { MenteesCard, RequestsCard, ScheduleCard } from './MentorCards'
import styles from './MentorHomePage.module.css'

// Главный экран ментора
export function MentorHomePage() {
  const [requests, setRequests] = useState(REQUESTS)

  // Пока нет API: ответ на запрос просто убирает его из списка
  const answer = (id: string) => setRequests((current) => current.filter((request) => request.id !== id))

  return (
    <div className={`${landingStyles.page} ${styles.page}`}>
      <UserHeader
        name={MENTOR.shortName}
        roleLabel="ментор"
        avatar={MENTOR.avatar}
        unread={['/messages', '/notifications']}
        profilePath="/mentor/profile"
      />
      <main className={styles.main}>
        <h1 className={styles.title}>Привет, {MENTOR.firstName}!</h1>
        <p className={styles.subtitle}>Здесь вы управляете наставничеством, заявками и развитием своих менти.</p>
        <div className={styles.grid}>
          <RequestsCard requests={requests} onAnswer={answer} />
          <ScheduleCard />
          <MenteesCard />
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}
