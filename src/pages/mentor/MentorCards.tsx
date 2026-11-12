import { Link } from 'react-router'
import smallChevron from '@/assets/icons/chevron-small.svg'
import plusIcon from '@/assets/icons/plus.svg'
import { Calendar } from '@/shared/ui/Calendar/Calendar'
import { CardHead } from '@/shared/ui/DashboardCard/DashboardCard'
import cardStyles from '@/shared/ui/DashboardCard/DashboardCard.module.css'
import { CALENDAR_START, EVENTS, MENTEES, type MenteeRequest } from './data'
import styles from './MentorHomePage.module.css'

// Высокая совместимость — зелёная метка, остальные — оранжевая
const HIGH_COMPATIBILITY = 80

type RequestsCardProps = {
  requests: MenteeRequest[]
  onAnswer: (id: string, accepted: boolean) => void
}

export function RequestsCard({ requests, onAnswer }: RequestsCardProps) {
  return (
    <section className={`${cardStyles.card} ${styles.requestsCard}`}>
      <CardHead more={{ to: '/mentor/requests', label: 'Все запросы' }}>
        <h2 className={cardStyles.cardTitle}>Новые запросы</h2>
      </CardHead>
      {requests.length === 0 ? (
        <p className={styles.empty}>Новых запросов нет</p>
      ) : (
        <ul className={styles.requests}>
          {requests.map((request) => (
            <li key={request.id} className={styles.request}>
              <img className={styles.photo} src={request.photo} alt="" width={60} height={60} />
              <div>
                <p className={styles.requestName}>{request.name}</p>
                <p className={styles.requestPosition}>{request.position}</p>
                <p className={styles.requestGoal}>Цель: {request.goal}</p>
              </div>
              <div className={styles.requestActions}>
                <span
                  className={`${cardStyles.pill} ${
                    request.compatibility >= HIGH_COMPATIBILITY ? cardStyles.pillGreen : cardStyles.pillOrange
                  } ${styles.compat}`}
                >
                  {request.compatibility}% совместимости
                </span>
                <button type="button" className={styles.accept} onClick={() => onAnswer(request.id, true)}>
                  Принять
                </button>
                <button type="button" className={styles.decline} onClick={() => onAnswer(request.id, false)}>
                  Отклонить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

const MARKED_DATES = new Set(EVENTS.map((event) => event.date))

export function ScheduleCard() {
  return (
    <section className={`${cardStyles.card} ${styles.scheduleCard}`} aria-labelledby="mentor-events">
      <div className={styles.calendarColumn}>
        <Calendar initialMonth={CALENDAR_START} markedDates={MARKED_DATES} compact />
        <Link to="/mentor/events" className={styles.createButton}>
          <img src={plusIcon} alt="" width={16} height={16} />
          Создать встречу
        </Link>
      </div>
      <div>
        <h2 id="mentor-events" className={`${cardStyles.cardTitle} ${styles.eventsTitle}`}>
          Ближайшие события
        </h2>
        <ul className={styles.events}>
          {EVENTS.map((event) => (
            <li key={event.id}>
              <Link to="/mentor/events" className={styles.event}>
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
      </div>
    </section>
  )
}

// Цвет полосы прогресса: хороший, средний, низкий
function progressLevel(progress: number) {
  if (progress >= 80) return styles.progressHigh
  if (progress >= 50) return styles.progressMedium
  return styles.progressLow
}

export function MenteesCard() {
  return (
    <section className={`${cardStyles.card} ${styles.menteesCard}`}>
      <CardHead more={{ to: '/mentor/mentees', label: 'Все менти' }}>
        <h2 className={cardStyles.cardTitle}>Мои менти</h2>
      </CardHead>
      <ul className={styles.mentees}>
        {MENTEES.map((mentee) => (
          <li key={mentee.id} className={styles.mentee}>
            <div className={styles.menteePerson}>
              <img className={styles.photo} src={mentee.photo} alt="" width={60} height={60} />
              <div>
                <p className={styles.menteeName}>{mentee.name}</p>
                <p className={styles.menteeGoal}>{mentee.goal}</p>
              </div>
            </div>
            <span className={styles.nextMeeting}>
              {mentee.nextMeeting && (
                <>
                  <span className={styles.hidden}>Следующая встреча: </span>
                  {mentee.nextMeeting}
                </>
              )}
            </span>
            <span
              className={styles.progressTrack}
              role="progressbar"
              aria-label={`Прогресс: ${mentee.name}`}
              aria-valuenow={mentee.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span className={`${styles.progressFill} ${progressLevel(mentee.progress)}`} style={{ width: `${mentee.progress}%` }} />
            </span>
            <span className={styles.progressValue}>{mentee.progress}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
