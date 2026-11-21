import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router'
import chartIcon from '@/assets/icons/chart-mixed.svg'
import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { SkillPairs } from '@/pages/profile/ProfileParts'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import { MENTOR } from '../data'
import { LEVELS, type MenteeDetails } from './menteeData'
import styles from './MenteeDetails.module.css'

// ---------- Каркас страницы ----------

type MenteeLayoutProps = {
  crumb: { to: string; label: string }
  mentee: MenteeDetails
  // Плашка над именем
  badge: ReactNode
  aside: ReactNode
  // Чуть ниже по вертикали, как в макете страницы менти
  lower?: boolean
  children: ReactNode
}

// Страница с данными менти: слева карточки, справа колонка действий
export function MenteeLayout({ crumb, mentee, badge, aside, lower, children }: MenteeLayoutProps) {
  return (
    <div className={`${landingStyles.page} ${styles.page}`}>
      <UserHeader
        name={MENTOR.shortName}
        roleLabel="ментор"
        avatar={MENTOR.avatar}
        profilePath="/mentor/profile"
      />
      <main className={[styles.main, lower && styles.lower].filter(Boolean).join(' ')}>
        <nav className={styles.crumbs} aria-label="Навигация">
          <Link to={crumb.to}>{crumb.label}</Link>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{mentee.name}</span>
        </nav>
        <div className={styles.layout}>
          <div className={styles.content}>
            <Hero mentee={mentee} badge={badge} />
            {children}
          </div>
          <aside className={styles.aside}>{aside}</aside>
        </div>
      </main>
      <LandingFooter />
    </div>
  )
}

function Hero({ mentee, badge }: { mentee: MenteeDetails; badge: ReactNode }) {
  return (
    <section className={`${styles.card} ${styles.hero}`}>
      {badge}
      <div className={styles.heroMain}>
        <span className={styles.avatar} style={{ background: mentee.color }} aria-hidden="true">
          {mentee.initials}
        </span>
        <div>
          <h1 className={styles.name}>{mentee.name}</h1>
          <p className={styles.subtitle}>{mentee.subtitle}</p>
          <ul className={styles.facts}>
            <li>
              Часовой пояс: <b>{mentee.timezone}</b>
            </li>
            <li>
              Язык общения: <b>{mentee.languages}</b>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}

// ---------- Карточки ----------

export function AboutCard({ mentee }: { mentee: MenteeDetails }) {
  return (
    <section className={`${styles.card} ${styles.about}`}>
      <h2 className={styles.cardTitle}>О менти</h2>
      <dl className={styles.aboutGrid}>
        {mentee.about.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export function SkillsCard({ mentee }: { mentee: MenteeDetails }) {
  return (
    <section className={`${styles.card} ${styles.skills}`}>
      <h2 className={styles.cardTitle}>Интересы и навыки</h2>
      <SkillPairs skills={mentee.skills} className={styles.skillPairs} />
    </section>
  )
}

type InteractionCardProps = {
  mentee: MenteeDetails
  // Серые плашки в заявке, светлые у своего менти
  tone: 'gray' | 'light'
  showLevel?: boolean
  // Отмеченные задачи; без него чекбоксы только для просмотра
  done?: string[]
  onToggleTask?: (task: string) => void
}

export function InteractionCard({ mentee, tone, showLevel, done, onToggleTask }: InteractionCardProps) {
  return (
    <section className={[styles.card, styles.interaction, tone === 'gray' && styles.gray].filter(Boolean).join(' ')}>
      <h2 className={styles.sectionTitle}>Взаимодействие с ментором</h2>

      <div className={styles.labelRow}>
        <h3 className={styles.label}>Требуемые навыки наставника</h3>
        <p className={styles.legend}>
          <span className={styles.legendMark}>✓</span> — есть в вашем профиле
        </p>
      </div>
      <ul className={styles.wanted}>
        {mentee.wantedSkills.map((skill) => (
          <li key={skill.name} className={skill.matched ? styles.wantedMatched : styles.wantedOther}>
            {skill.matched && <span aria-hidden="true">✓ </span>}
            {skill.name}
            {skill.matched && <span className={styles.hidden}> (есть в вашем профиле)</span>}
          </li>
        ))}
      </ul>

      {showLevel && (
        <>
          <h3 className={styles.label}>Уровень знаний</h3>
          <ul className={styles.levels}>
            {LEVELS.map((level) => (
              <li key={level} className={level === mentee.level ? styles.levelActive : undefined} aria-current={level === mentee.level || undefined}>
                {level}
              </li>
            ))}
          </ul>
        </>
      )}

      <h3 className={styles.label}>Задачи, с которыми нужна помощь</h3>
      <ul className={styles.tasks}>
        {mentee.tasks.map((task) => (
          <li key={task}>
            <label className={styles.task}>
              <input
                type="checkbox"
                checked={done?.includes(task) ?? false}
                disabled={!onToggleTask}
                onChange={() => onToggleTask?.(task)}
              />
              <span className={styles.taskBox} aria-hidden="true" />
              {task}
            </label>
          </li>
        ))}
      </ul>

      <dl className={styles.terms}>
        <div>
          <dt>Формат взаимодействия</dt>
          <dd>{mentee.format}</dd>
        </div>
        <div>
          <dt>Доступность</dt>
          <dd>{mentee.availability}</dd>
        </div>
        <div>
          <dt>Бюджет</dt>
          <dd>{mentee.budget}</dd>
        </div>
      </dl>
    </section>
  )
}

export function GoalCard({ mentee }: { mentee: MenteeDetails }) {
  return (
    <section className={`${styles.card} ${styles.goalCard}`}>
      <h2 className={styles.sectionTitle}>Цель</h2>
      <div className={styles.goal}>
        <span className={styles.goalIcon}>
          <img src={chartIcon} alt="" width={45} height={45} />
        </span>
        <div className={styles.goalMain}>
          <p className={styles.goalLabel}>Основная цель</p>
          <p className={styles.goalTitle}>{mentee.goal.title}</p>
        </div>
        <div className={styles.goalTerm}>
          <p className={styles.goalLabel}>Срок достижения</p>
          <p className={styles.goalTermValue}>{mentee.goal.term}</p>
          <p className={styles.goalDeadline}>{mentee.goal.deadline}</p>
        </div>
      </div>
    </section>
  )
}

// ---------- Совместимость ----------

type RingProps = {
  value: number
  size: 'lg' | 'sm'
}

// Кольцо совместимости
export function MatchRing({ value, size }: RingProps) {
  return (
    <div className={`${styles.ring} ${size === 'lg' ? styles.ringLarge : styles.ringSmall}`} style={{ '--ring-value': `${value}%` } as CSSProperties}>
      <span className={styles.ringValue}>{value}%</span>
      {size === 'lg' && <span className={styles.ringLabel}>совместимость</span>}
    </div>
  )
}
