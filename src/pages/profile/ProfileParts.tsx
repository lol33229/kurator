import type { ReactNode } from 'react'
import { Link } from 'react-router'
import calendarIcon from '@/assets/icons/calendar-small.svg'
import chevronRight from '@/assets/icons/chevron-right.svg'
import pencilIcon from '@/assets/icons/pencil-edit.svg'
import starLarge from '@/assets/icons/star-large.svg'
import starIcon from '@/assets/icons/star.svg'
import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import cardStyles from '@/shared/ui/DashboardCard/DashboardCard.module.css'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import styles from './Profile.module.css'
import { isGoodProgress } from './progress'

// ---------- Страница ----------

type ProfileLayoutProps = {
  user: { name: string; roleLabel: string; avatar: string }
  profilePath: string
  subtitle: string
  className?: string
  children: ReactNode
}

// Общий каркас страницы профиля
export function ProfileLayout({ user, profilePath, subtitle, className, children }: ProfileLayoutProps) {
  return (
    <div className={[landingStyles.page, styles.page, className].filter(Boolean).join(' ')}>
      <UserHeader
        name={user.name}
        roleLabel={user.roleLabel}
        avatar={user.avatar}
        profilePath={profilePath}
      />
      <main className={styles.main}>
        <h1 className={styles.title}>Мой профиль</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <div className={styles.sections}>{children}</div>
      </main>
      <LandingFooter />
    </div>
  )
}

// ---------- Секция ----------

export type ActionProps = {
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

export function Section({ title, subtitle, action, aside, className, children }: SectionProps) {
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

// ---------- Навыки ----------

export type SkillLevel = { skill: string; level: string }

// Навык и рядом уровень владения в зелёной рамке
export function SkillPairs({ skills, className }: { skills: SkillLevel[]; className?: string }) {
  return (
    <ul className={[styles.skillList, className].filter(Boolean).join(' ')}>
      {skills.map((item) => (
        <li key={item.skill} className={styles.skillPair}>
          <span className={styles.skill}>{item.skill}</span>
          <span className={styles.level}>{item.level}</span>
        </li>
      ))}
    </ul>
  )
}

// ---------- Прогресс ----------

type ProgressProps = {
  value: number
  label: string
  className?: string
}

export function Progress({ value, label, className }: ProgressProps) {
  const color = value === 100 ? styles.done : isGoodProgress(value) ? styles.good : styles.low
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
        <span className={`${styles.progressFill} ${color}`} style={{ width: `${value}%` }} />
      </span>
      <span className={styles.progressValue}>{value}%</span>
    </div>
  )
}

// ---------- История и отзывы ----------

type PersonProps = { name: string; position: string; photo: string }

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

export type HistoryItem = PersonProps & {
  id: string
  current: boolean
  period: string
  goal: string
  progress: number
}

type HistorySectionProps = {
  items: HistoryItem[]
  // «Текущий наставник» у менти, «Текущий менти» у ментора
  currentLabel: string
  historyPath: string
}

export function HistorySection({ items, currentLabel, historyPath }: HistorySectionProps) {
  return (
    <Section
      title="История наставничества"
      subtitle="Ваши прошлые и текущие пары, цели и результаты"
      action={{ to: historyPath, label: 'Вся история', icon: 'next' }}
      className={styles.history}
    >
      <ul className={styles.rows}>
        {items.map((item) => (
          <li key={item.id} className={styles.historyRow}>
            <Person {...item} />
            <div>
              <span className={`${styles.statusBadge} ${item.current ? styles.current : styles.finished}`}>
                {item.current ? currentLabel : 'Завершено'}
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

export type Review = PersonProps & {
  id: string
  rating: number
  date: string
  text: string
}

type ReviewsSectionProps = {
  subtitle: string
  reviews: Review[]
  reviewsPath: string
}

export function ReviewsSection({ subtitle, reviews, reviewsPath }: ReviewsSectionProps) {
  const average = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  return (
    <Section
      title="Отзывы"
      subtitle={subtitle}
      action={{ to: reviewsPath, label: 'Все отзывы', icon: 'next' }}
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
        {reviews.map((review) => (
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
