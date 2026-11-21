import { CompatRing } from './CompatRing'
import { BEST_MATCH, formatExperience, formatFormats, formatMoney, type SearchMentor } from './data'
import styles from './MentorSearch.module.css'

export type MentorActions = {
  sent: boolean
  compared: boolean
  onSend: () => void
  onCompare: () => void
  onOpenProfile: () => void
}

// Аватар с инициалами
export function Initials({ mentor, size, className }: { mentor: SearchMentor; size: number; className?: string }) {
  return (
    <span
      className={[styles.initials, className].filter(Boolean).join(' ')}
      style={{ width: size, height: size, background: mentor.color, fontSize: size < 40 ? 12 : size > 90 ? 30 : 22 }}
      aria-hidden="true"
    >
      {mentor.initials}
    </span>
  )
}

export function SendButton({ sent, onSend, className }: { sent: boolean; onSend: () => void; className?: string }) {
  return (
    <button
      type="button"
      className={[styles.button, sent ? styles.sentButton : styles.primaryButton, className].filter(Boolean).join(' ')}
      disabled={sent}
      onClick={onSend}
    >
      {sent ? '✓ Заявка отправлена' : 'Отправить заявку'}
    </button>
  )
}

export function CompareButton({ compared, onCompare, className }: { compared: boolean; onCompare: () => void; className?: string }) {
  return (
    <button
      type="button"
      className={[styles.button, compared ? styles.comparedButton : styles.secondaryButton, className].filter(Boolean).join(' ')}
      aria-pressed={compared}
      onClick={onCompare}
    >
      {compared ? '✓ В сравнении' : '+ Добавить к сравнению'}
    </button>
  )
}

export function Reasons({ title, reasons, className }: { title: string; reasons: string[]; className?: string }) {
  return (
    <div className={[styles.reasons, className].filter(Boolean).join(' ')}>
      <h4 className={styles.reasonsTitle}>{title}</h4>
      <ul className={styles.reasonsList}>
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </div>
  )
}

export function SkillTags({ skills, className }: { skills: string[]; className?: string }) {
  return (
    <ul className={[styles.tags, className].filter(Boolean).join(' ')} aria-label="Навыки">
      {skills.map((skill) => (
        <li key={skill} className={styles.tag}>
          {skill}
        </li>
      ))}
    </ul>
  )
}

// Карточка наставника в выдаче
export function MentorResultCard({ mentor, actions }: { mentor: SearchMentor; actions: MentorActions }) {
  return (
    <article className={styles.card}>
      <div className={styles.cardMain}>
        <div className={styles.person}>
          <Initials mentor={mentor} size={72} className={styles.personAvatar} />
          <div>
            <div className={styles.nameRow}>
              <h3 className={styles.name}>{mentor.name}</h3>
              {mentor.compatibility >= BEST_MATCH && <span className={styles.best}>Лучшее совпадение</span>}
            </div>
            <p className={styles.position}>
              {mentor.position} · {mentor.company}
            </p>
          </div>
        </div>
        <SkillTags skills={mentor.skills} />
        <dl className={styles.stats}>
          <div>
            <dt>Опыт</dt>
            <dd>{formatExperience(mentor.experience)}</dd>
          </div>
          <div>
            <dt>Формат</dt>
            <dd>{formatFormats(mentor)}</dd>
          </div>
          <div>
            <dt>Доступность</dt>
            <dd>{mentor.hoursPerWeek} ч/нед</dd>
          </div>
          <div>
            <dt>Рейтинг</dt>
            <dd>★ {mentor.rating}</dd>
            <span>({mentor.reviews})</span>
          </div>
        </dl>
        <Reasons title="Почему подходит" reasons={mentor.reasons} />
      </div>

      <div className={styles.cardSide}>
        <CompatRing value={mentor.compatibility} />
        <p className={styles.price}>
          {mentor.price === null ? (
            'Бесплатно'
          ) : (
            <>
              {formatMoney(mentor.price)}
              <span className={styles.priceUnit}> / час</span>
            </>
          )}
        </p>
        <SendButton sent={actions.sent} onSend={actions.onSend} />
        <CompareButton compared={actions.compared} onCompare={actions.onCompare} />
        <button type="button" className={styles.profileLink} onClick={actions.onOpenProfile}>
          Полный профиль
        </button>
      </div>
    </article>
  )
}
