import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { useMenteeMatches } from '../matchProfiles'
import { findMentee, type MatchFactor } from './menteeData'
import { AboutCard, GoalCard, InteractionCard, MatchRing, MenteeLayout, SkillsCard } from './MenteeParts'
import styles from './MenteeDetails.module.css'

type Status = 'new' | 'accepted' | 'declined'

// Полоса совпадения: полное совпадение темнее
function Factor({ factor }: { factor: MatchFactor }) {
  return (
    <li className={styles.factor}>
      <div className={styles.factorHead}>
        <span>{factor.label}</span>
        <b>{factor.valueLabel ?? `${factor.value}%`}</b>
      </div>
      <div className={styles.factorTrack}>
        <span className={factor.value >= 90 ? styles.factorFull : styles.factorPart} style={{ width: `${factor.value}%` }} />
      </div>
      <p className={styles.factorNote}>{factor.note}</p>
    </li>
  )
}

// Заявка менти к ментору
export function MenteeRequestPage() {
  const mentee = findMentee(useParams().id)
  const [status, setStatus] = useState<Status>('new')
  const scores = useMenteeMatches()
  if (!mentee) return <PagePlaceholder title="Заявка не найдена" />

  const aside = (
    <>
      <section className={`${styles.sideCard} ${styles.match}`}>
        <h2 className={styles.matchTitle}>Процент совместимости</h2>
        <MatchRing value={scores.get(mentee.id) ?? mentee.compatibility} size="lg" />
        <p className={styles.matchCaption}>Рассчитан ИИ по анкетам — вашей и менти</p>
        <ul className={styles.factors}>
          {mentee.factors.map((factor) => (
            <Factor key={factor.label} factor={factor} />
          ))}
        </ul>
      </section>

      <section className={`${styles.sideCard} ${styles.decision}`} aria-live="polite">
        {status === 'new' && (
          <>
            <p className={styles.deadline}>
              Ответьте в течение {mentee.responseDays} дней, иначе заявка закроется
            </p>
            <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => setStatus('accepted')}>
              Принять заявку
            </button>
            <button type="button" className={`${styles.button} ${styles.secondary}`} onClick={() => setStatus('declined')}>
              Отклонить
            </button>
            <p className={styles.sideNote}>Чат и контакты менти откроются после принятия заявки</p>
          </>
        )}
        {status === 'accepted' && (
          <>
            <p className={styles.accepted}>Заявка принята — {mentee.name} теперь ваш менти</p>
            <Link to={`/mentor/mentees/${mentee.id}`} className={`${styles.button} ${styles.primary}`}>
              Перейти к менти
            </Link>
          </>
        )}
        {status === 'declined' && (
          <>
            <p className={styles.declined}>Заявка отклонена</p>
            <Link to="/mentor" className={`${styles.button} ${styles.secondary}`}>
              На главную
            </Link>
          </>
        )}
      </section>
    </>
  )

  const badge = (
    <p className={`${styles.badge} ${styles.badgeNew}`}>
      <span aria-hidden="true">● </span>
      Новая заявка · получена {mentee.requestDate}
    </p>
  )

  return (
    <MenteeLayout crumb={{ to: '/mentor/requests', label: 'Заявки' }} mentee={mentee} badge={badge} aside={aside}>
      <AboutCard mentee={mentee} />
      <SkillsCard mentee={mentee} />
      <InteractionCard mentee={mentee} tone="gray" />
      <GoalCard mentee={mentee} />
    </MenteeLayout>
  )
}
