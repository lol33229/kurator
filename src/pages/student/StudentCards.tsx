import type { ReactNode } from 'react'
import { Link } from 'react-router'
import calendarIcon from '@/assets/icons/calendar.svg'
import chartIcon from '@/assets/icons/chart-mixed.svg'
import smallChevron from '@/assets/icons/chevron-small.svg'
import chevronIcon from '@/assets/icons/chevron-wide.svg'
import pencilIcon from '@/assets/icons/pencil.svg'
import { EVENTS, GOAL, REQUESTS, SUGGESTIONS, type Mentor, type RequestStatus } from './data'
import styles from './StudentHomePage.module.css'

type MoreLinkProps = {
  to: string
  label: string
  className?: string
}

// Стрелка «подробнее» в углу карточки
function MoreLink({ to, label, className }: MoreLinkProps) {
  return (
    <Link to={to} className={[styles.more, className].filter(Boolean).join(' ')} aria-label={label}>
      <img src={chevronIcon} alt="" width={23} height={24} />
    </Link>
  )
}

type PersonProps = {
  name: string
  position: string
  photo: string
}

function Person({ name, position, photo }: PersonProps) {
  return (
    <div className={styles.person}>
      <img className={styles.personPhoto} src={photo} alt="" width={60} height={60} />
      <div>
        <p className={styles.personName}>{name}</p>
        <p className={styles.personPosition}>{position}</p>
      </div>
    </div>
  )
}

function CardHead({ children, more }: { children: ReactNode; more: MoreLinkProps }) {
  return (
    <div className={styles.cardHead}>
      {children}
      <MoreLink {...more} />
    </div>
  )
}

export function MentorCard({ mentor }: { mentor: Mentor }) {
  // Полный ряд навыков растягиваем на всю ширину, короткий — нет
  const isFullRow = Boolean(mentor.moreTags)
  return (
    <article className={`${styles.card} ${styles.mentorCard}`}>
      <CardHead more={{ to: '/mentors', label: `Профиль наставника ${mentor.name}` }}>
        <span className={styles.badge}>Ваш наставник</span>
      </CardHead>
      <div className={styles.mentorProfile}>
        <img className={styles.mentorPhoto} src={mentor.photo} alt="" width={100} height={100} />
        <div>
          <h2 className={styles.mentorName}>{mentor.name}</h2>
          <p className={styles.mentorPosition}>
            {mentor.position}
            <br />
            {mentor.company}
          </p>
        </div>
      </div>
      <ul className={[styles.tags, isFullRow && styles.tagsFull].filter(Boolean).join(' ')}>
        {mentor.tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
        {mentor.moreTags && <li className={styles.tag}>+{mentor.moreTags}</li>}
      </ul>
      <Link to="/messages" className={styles.writeButton}>
        <img src={pencilIcon} alt="" width={16} height={16} />
        Написать
      </Link>
    </article>
  )
}

const STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Ожидает ответа',
  accepted: 'Согласовано',
}

export function RequestsCard() {
  return (
    <section className={`${styles.card} ${styles.requestsCard}`}>
      <CardHead more={{ to: '/student/requests', label: 'Все заявки' }}>
        <h2 className={styles.cardTitle}>Мои заявки</h2>
      </CardHead>
      <ul className={styles.requests}>
        {REQUESTS.map((request) => (
          <li key={request.id} className={styles.request}>
            <Person {...request} />
            <span className={`${styles.status} ${styles[request.status]}`}>{STATUS_LABELS[request.status]}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function FindMentorCard() {
  return (
    <section className={`${styles.card} ${styles.findCard}`}>
      <CardHead more={{ to: '/mentors', label: 'Все рекомендации' }}>
        <h2 className={styles.cardTitle}>Найти ментора</h2>
      </CardHead>
      <p className={styles.findText}>
        Еще не нашли идеального наставника?
        <br />
        Мы подобрали для вас рекомендации!
      </p>
      <ul className={styles.suggestions}>
        {SUGGESTIONS.map((mentor) => (
          <li key={mentor.id}>
            <Link to="/mentors" className={styles.suggestion}>
              <Person {...mentor} />
              <span className={styles.suggestionFooter}>
                <span className={`${styles.status} ${styles.compat}`}>{mentor.compatibility}% совместимости</span>
                <img className={styles.suggestionChevron} src={chevronIcon} alt="" width={23} height={24} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function EventsCard() {
  return (
    <section className={`${styles.card} ${styles.eventsCard}`}>
      <CardHead more={{ to: '/student/events', label: 'Все события' }}>
        <h2 className={`${styles.cardTitle} ${styles.eventsTitle}`}>
          <img src={calendarIcon} alt="" width={25} height={25} />
          Ближайшие события
        </h2>
      </CardHead>
      <ul className={styles.events}>
        {EVENTS.map((event) => (
          <li key={event.id}>
            <Link to="/student/events" className={styles.event}>
              <span className={styles.eventDate}>
                {event.day}
                <br />
                {event.month}
              </span>
              <span className={styles.eventInfo}>
                <span className={styles.eventTitle}>{event.title}</span>
                <span className={styles.eventTime}>
                  {event.time} {event.place}
                </span>
              </span>
              <img className={styles.eventChevron} src={smallChevron} alt="" width={12} height={5} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function GoalCard() {
  return (
    <section className={`${styles.card} ${styles.goalCard}`}>
      <CardHead more={{ to: '/student/goals', label: 'Все цели' }}>
        <h2 className={styles.cardTitle}>Ваша цель</h2>
      </CardHead>
      <div className={styles.goal}>
        <span className={styles.goalIcon}>
          <img src={chartIcon} alt="" width={45} height={45} />
        </span>
        <div>
          <p className={styles.goalTitle}>{GOAL.title}</p>
          <p className={styles.goalText}>{GOAL.description}</p>
        </div>
      </div>
      <div className={styles.progress}>
        <div
          className={styles.progressTrack}
          role="progressbar"
          aria-label="Прогресс цели"
          aria-valuenow={GOAL.progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div className={styles.progressFill} style={{ width: `${GOAL.progress}%` }} />
        </div>
        <span className={styles.progressValue}>{GOAL.progress}%</span>
      </div>
    </section>
  )
}
