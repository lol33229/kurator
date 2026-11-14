import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import avatarEditIcon from '@/assets/icons/avatar-edit.svg'
import calendarIcon from '@/assets/icons/calendar-small.svg'
import chartIcon from '@/assets/icons/chart-mixed.svg'
import chevronRight from '@/assets/icons/chevron-right.svg'
import clockIcon from '@/assets/icons/clock.svg'
import pencilIcon from '@/assets/icons/pencil-edit.svg'
import starLarge from '@/assets/icons/star-large.svg'
import starIcon from '@/assets/icons/star.svg'
import videoIcon from '@/assets/icons/video.svg'
import cardStyles from '@/shared/ui/DashboardCard/DashboardCard.module.css'
import { GoalsModal } from './GoalsModal'
import { AVAILABILITY, GOALS, HISTORY, PROFILE, REVIEWS, SKILLS } from './profileData'
import styles from './StudentProfilePage.module.css'

type ActionProps = {
  label: string
  icon: 'edit' | 'next'
  // Ссылка на другую страницу или действие на этой
  to?: string
  onClick?: () => void
}

// Салатовая кнопка в правом углу секции
function Action({ to, onClick, label, icon }: ActionProps) {
  const content = (
    <>
      {icon === 'edit' && <img src={pencilIcon} alt="" width={16} height={16} />}
      {label}
      {icon === 'next' && <img src={chevronRight} alt="" width={16} height={16} />}
    </>
  )
  if (to) {
    return (
      <Link to={to} className={styles.action}>
        {content}
      </Link>
    )
  }
  return (
    <button type="button" className={styles.action} onClick={onClick}>
      {content}
    </button>
  )
}

type SectionProps = {
  title: string
  subtitle: string
  action: ActionProps
  // Дополнительный элемент слева от кнопки
  aside?: ReactNode
  className?: string
  children: ReactNode
}

function Section({ title, subtitle, action, aside, className, children }: SectionProps) {
  return (
    <section className={[cardStyles.card, styles.section, className].filter(Boolean).join(' ')}>
      <div className={styles.sectionHead}>
        <div>
          <h2 className={cardStyles.cardTitle}>{title}</h2>
          <p className={styles.sectionSubtitle}>{subtitle}</p>
        </div>
        {aside}
        <Action {...action} />
      </div>
      {children}
    </section>
  )
}

const EDIT_PATH = '/student/profile/edit'

// Фото профиля с выбором нового файла; пока нет API, фото меняется только на экране
function ProfilePhoto() {
  const [photo, setPhoto] = useState(PROFILE.photo)
  useEffect(() => () => URL.revokeObjectURL(photo), [photo])

  return (
    <div className={styles.photo}>
      <img className={styles.photoImage} src={photo} alt="Фото профиля" width={100} height={100} />
      <label className={styles.photoEdit}>
        <input
          type="file"
          accept="image/*"
          className={styles.hidden}
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) setPhoto(URL.createObjectURL(file))
          }}
        />
        <img src={avatarEditIcon} alt="" width={30} height={30} />
        <span className={styles.hidden}>Сменить фото</span>
      </label>
    </div>
  )
}

export function PersonalSection() {
  return (
    <Section
      title="Личные данные"
      subtitle="Основная информация о вас, которая видна наставникам"
      action={{ to: EDIT_PATH, label: 'Редактировать', icon: 'edit' }}
      className={styles.personal}
    >
      <div className={styles.personalBody}>
        <ProfilePhoto />
        <dl className={styles.fields}>
          {PROFILE.fields.map((field) => (
            <div key={field.label}>
              <dt>{field.label}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}

export function SkillsSection() {
  return (
    <Section
      title="Интересы и навыки"
      subtitle="Области, которые вам интересны и ваши текущие навыки и уровень владения"
      action={{ to: EDIT_PATH, label: 'Редактировать', icon: 'edit' }}
      className={styles.skills}
    >
      <ul className={styles.skillList}>
        {SKILLS.map((item) => (
          <li key={item.skill} className={styles.skillPair}>
            <span className={styles.skill}>{item.skill}</span>
            <span className={styles.level}>{item.level}</span>
          </li>
        ))}
      </ul>
    </Section>
  )
}

// Хороший прогресс — зелёный, остальной — розовый
const progressColor = (progress: number) => (progress >= 50 ? styles.good : styles.low)

function Progress({ value, label, className }: { value: number; label: string; className?: string }) {
  return (
    <div className={[styles.progress, className].filter(Boolean).join(' ')}>
      <span
        className={styles.progressTrack}
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span
          className={`${styles.progressFill} ${value === 100 ? styles.done : progressColor(value)}`}
          style={{ width: `${value}%` }}
        />
      </span>
      <span className={styles.progressValue}>{value}%</span>
    </div>
  )
}

// Цель для задачи: из данных профиля или новая с нулевым прогрессом
const goalForTask = (task: string) =>
  GOALS.find((goal) => goal.task === task) ?? {
    task,
    title: task,
    description: 'Новая цель: прогресс появится после первых задач с наставником',
    progress: 0,
  }

export function GoalsSection() {
  const [tasks, setTasks] = useState(GOALS.map((goal) => goal.task))
  const [editing, setEditing] = useState(false)

  return (
    <Section
      title="Цели"
      subtitle="К чему вы стремитесь в рамках наставничества"
      action={{ onClick: () => setEditing(true), label: 'Редактировать', icon: 'edit' }}
      className={styles.goals}
    >
      <ul className={styles.goalList}>
        {tasks.map(goalForTask).map((goal) => (
          <li key={goal.task}>
            <div className={styles.goal}>
              <span className={`${styles.goalIcon} ${progressColor(goal.progress)}`}>
                <img src={chartIcon} alt="" width={45} height={45} />
              </span>
              <div>
                <p className={styles.goalTitle}>{goal.title}</p>
                <p className={styles.goalText}>{goal.description}</p>
              </div>
            </div>
            <Progress value={goal.progress} label={`Прогресс цели «${goal.title}»`} className={styles.goalProgress} />
          </li>
        ))}
      </ul>
      {editing && (
        <GoalsModal
          tasks={tasks}
          onClose={() => setEditing(false)}
          onSave={(next) => {
            setTasks(next)
            setEditing(false)
          }}
        />
      )}
    </Section>
  )
}

export function AvailabilitySection() {
  const rows = [
    { icon: calendarIcon, label: 'Дни', value: AVAILABILITY.days },
    { icon: clockIcon, label: 'Время', value: AVAILABILITY.time },
    { icon: videoIcon, label: 'Формат', value: AVAILABILITY.format },
  ]
  return (
    <Section
      title="Доступность"
      subtitle="Когда вам удобно взаимодействовать с наставником"
      action={{ to: EDIT_PATH, label: 'Редактировать', icon: 'edit' }}
      className={styles.availability}
    >
      <dl className={styles.availabilityList}>
        {rows.map((row) => (
          <div key={row.label}>
            <dt>
              <img src={row.icon} alt="" width={20} height={20} />
              {row.label}
            </dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}

function Person({ name, position, photo }: { name: string; position: string; photo: string }) {
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

export function HistorySection() {
  return (
    <Section
      title="История наставничества"
      subtitle="Ваши прошлые и текущие пары, цели и результаты"
      action={{ to: '/student/history', label: 'Вся история', icon: 'next' }}
      className={styles.history}
    >
      <ul className={styles.rows}>
        {HISTORY.map((item) => (
          <li key={item.id} className={styles.historyRow}>
            <Person {...item} />
            <div>
              <span className={`${styles.statusBadge} ${item.current ? styles.current : styles.finished}`}>
                {item.current ? 'Текущий наставник' : 'Завершено'}
              </span>
              <p className={styles.period}>
                <img src={calendarIcon} alt="" width={20} height={20} />
                {item.period}
              </p>
            </div>
            <div className={styles.historyGoal}>
              <p className={styles.historyGoalTitle}>Цель: {item.goal}</p>
              <Progress value={item.progress} label={`Прогресс цели «${item.goal}»`} className={styles.historyProgress} />
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <p className={styles.stars}>
      <span className={styles.starIcons} aria-hidden="true">
        {Array.from({ length: rating }, (_, index) => (
          <img key={index} src={starIcon} alt="" width={16} height={16} />
        ))}
      </span>
      <span className={styles.hidden}>Оценка: </span>
      {rating}
    </p>
  )
}

export function ReviewsSection() {
  const average = REVIEWS.reduce((sum, review) => sum + review.rating, 0) / REVIEWS.length
  return (
    <Section
      title="Отзывы"
      subtitle="Отзывы от ваших наставников"
      action={{ to: '/student/reviews', label: 'Все отзывы', icon: 'next' }}
      aside={
        <p className={styles.average}>
          <img src={starLarge} alt="" width={30} height={30} />
          <span className={styles.hidden}>Средняя оценка: </span>
          {average.toFixed(1).replace('.', ',')}
        </p>
      }
      className={styles.reviews}
    >
      <ul className={styles.rows}>
        {REVIEWS.map((review) => (
          <li key={review.id} className={styles.reviewRow}>
            <Person {...review} />
            <div>
              <Stars rating={review.rating} />
              <p className={styles.reviewText}>{review.text}</p>
            </div>
            <p className={styles.reviewDate}>{review.date}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
