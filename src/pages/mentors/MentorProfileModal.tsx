import { useId } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { CompatRing } from './CompatRing'
import { CompareButton, Initials, Reasons, SendButton, SkillTags, type MentorActions } from './MentorResultCard'
import { capitalize, formatDurations, formatExperience, formatPrice, formatReviews, plural, type SearchMentor } from './data'
import styles from './MentorProfileModal.module.css'

// Профиль наставника глазами менти
export function MentorProfileModal({ mentor, actions, onClose }: { mentor: SearchMentor; actions: MentorActions; onClose: () => void }) {
  const titleId = useId()
  const hours = mentor.hoursPerWeek
  const info = [
    ['Направление', mentor.direction],
    ['Опыт', formatExperience(mentor.experience)],
    ['Формат', mentor.formats.map(capitalize).join(', ')],
    ['Доступность', `${hours} ${plural(hours, 'час', 'часа', 'ч')} в неделю`],
    ['Продолжительность', formatDurations(mentor)],
    ['Стоимость', formatPrice(mentor)],
    ['Город', mentor.city],
    ['Рейтинг', `★ ${mentor.rating} (${formatReviews(mentor.reviews)})`],
  ]

  return (
    <Modal labelledBy={titleId} onClose={onClose} className={styles.dialog}>
      <p className={styles.caption}>Профиль ментора</p>

      <section className={styles.top}>
        <Initials mentor={mentor} size={96} className={styles.avatar} />
        <div className={styles.identity}>
          <h2 id={titleId} className={styles.name}>
            {mentor.name}
          </h2>
          <p className={styles.position}>
            {mentor.position} · {mentor.company}
          </p>
          <SkillTags skills={mentor.skills} className={styles.tags} />
        </div>
        <CompatRing value={mentor.compatibility} className={styles.ring} />
      </section>

      <div className={styles.columns}>
        <section className={styles.card}>
          <h3 className={styles.cardTitle}>Информация</h3>
          <dl className={styles.info}>
            {info.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={`${styles.card} ${styles.actions}`} aria-label="Действия">
          <Reasons title="Критерии мэтча" reasons={mentor.reasons} />
          <SendButton sent={actions.sent} onSend={actions.onSend} className={styles.action} />
          <CompareButton compared={actions.compared} onCompare={actions.onCompare} className={styles.action} />
          {/* Чат откроется, когда наставник примет заявку */}
          <button type="button" className={styles.write} disabled aria-describedby={`${titleId}-note`}>
            Написать
          </button>
          <p id={`${titleId}-note`} className={styles.note}>
            Написать можно после того, как наставник примет заявку
          </p>
        </section>
      </div>
    </Modal>
  )
}
