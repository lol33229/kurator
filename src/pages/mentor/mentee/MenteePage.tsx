import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { findMentee } from './menteeData'
import { AboutCard, GoalCard, InteractionCard, MatchRing, MenteeLayout, SkillsCard } from './MenteeParts'
import styles from './MenteeDetails.module.css'

// Страница своего менти
export function MenteePage() {
  const mentee = findMentee(useParams().id)
  const [done, setDone] = useState<string[]>([])
  if (!mentee) return <PagePlaceholder title="Менти не найден" />

  const toggleTask = (task: string) =>
    setDone((list) => (list.includes(task) ? list.filter((item) => item !== task) : [...list, task]))
  const meeting = mentee.nextMeeting

  const aside = (
    <div className={styles.sticky}>
      <section className={`${styles.sideCard} ${styles.actions}`} aria-label="Действия">
        <Link to="/messages" className={`${styles.button} ${styles.primary}`}>
          Написать
        </Link>
        <Link to="/mentor/events" className={`${styles.button} ${styles.primary}`}>
          Запланировать встречу
        </Link>
        <Link to="/mentor/reviews" className={`${styles.button} ${styles.secondary}`}>
          Оценить
        </Link>
      </section>

      <section className={`${styles.sideCard} ${styles.matchSmall}`}>
        <MatchRing value={mentee.compatibility} size="sm" />
        <div>
          <h2 className={styles.sideTitle}>Процент совместимости</h2>
          <p className={styles.matchText}>Совпадают цель, навыки, формат и часовой пояс</p>
        </div>
      </section>

      <section className={`${styles.sideCard} ${styles.meetingCard}`}>
        <h2 className={styles.sideTitle}>Ближайшая встреча</h2>
        <Link to="/mentor/events" className={styles.meeting}>
          <span className={styles.meetingDate}>
            <b>{meeting.day}</b>
            {meeting.month}
          </span>
          <span>
            <span className={styles.meetingTitle}>{meeting.title}</span>
            <span className={styles.meetingTime}>{meeting.time}</span>
          </span>
        </Link>
      </section>
    </div>
  )

  const badge = <p className={`${styles.badge} ${styles.badgePair}`}>Ваш менти · пара с {mentee.pairSince}</p>

  return (
    <MenteeLayout crumb={{ to: '/mentor/mentees', label: 'Мои менти' }} mentee={mentee} badge={badge} aside={aside} lower>
      <AboutCard mentee={mentee} />
      <SkillsCard mentee={mentee} />
      <InteractionCard mentee={mentee} tone="light" showLevel done={done} onToggleTask={toggleTask} />
      <GoalCard mentee={mentee} />
    </MenteeLayout>
  )
}
