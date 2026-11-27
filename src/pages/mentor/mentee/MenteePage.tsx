import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router'
import { MENTEE_CRITERIA } from '@/pages/reviews/criteria'
import { ReviewModal } from '@/pages/reviews/ReviewModal'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { Toast } from '@/shared/ui/Toast/Toast'
import { MENTOR } from '../data'
import { findMentee } from './menteeData'
import { AboutCard, GoalCard, InteractionCard, MatchRing, MenteeLayout, SkillsCard } from './MenteeParts'
import styles from './MenteeDetails.module.css'

// Страница своего менти
export function MenteePage() {
  const mentee = findMentee(useParams().id)
  const [done, setDone] = useState<string[]>([])
  const [reviewOpen, setReviewOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const hideToast = useCallback(() => setToast(null), [setToast])
  const closeReview = useCallback(() => setReviewOpen(false), [setReviewOpen])
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
        <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={() => setReviewOpen(true)}>
          Оценить
        </button>
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
    <>
      <MenteeLayout crumb={{ to: '/mentor/mentees', label: 'Мои менти' }} mentee={mentee} badge={badge} aside={aside} lower>
        <AboutCard mentee={mentee} />
        <SkillsCard mentee={mentee} />
        <InteractionCard mentee={mentee} tone="light" showLevel done={done} onToggleTask={toggleTask} />
        <GoalCard mentee={mentee} />
      </MenteeLayout>
      {reviewOpen && (
        <ReviewModal
          title="Оценить менти"
          author={{ id: 'anton', name: MENTOR.shortName, role: 'Ментор' }}
          target={{ id: mentee.id, name: mentee.name, role: 'Менти' }}
          criteria={MENTEE_CRITERIA}
          onDone={(message) => {
            setReviewOpen(false)
            setToast(message)
          }}
          onClose={closeReview}
        />
      )}
      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
