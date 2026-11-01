import { Fragment } from 'react'
import arrowRight from '@/assets/landing/arrow-right.svg'
import badgeIncome from '@/assets/landing/badge-income.svg'
import badgeSchedule from '@/assets/landing/badge-schedule.svg'
import badgeStudents from '@/assets/landing/badge-students.svg'
import mentorBlob from '@/assets/landing/mentor-blob.svg'
import mentorLine1 from '@/assets/landing/mentor-line-1.svg'
import mentorLine2 from '@/assets/landing/mentor-line-2.svg'
import mentorPhoto from '@/assets/landing/mentor-photo.png'
import stepGoal from '@/assets/landing/step-goal.svg'
import stepMatch from '@/assets/landing/step-match.svg'
import stepResult from '@/assets/landing/step-result.svg'
import whyAi from '@/assets/landing/why-ai.svg'
import whyCurator from '@/assets/landing/why-curator.svg'
import whyGoal from '@/assets/landing/why-goal.svg'
import whyProgress from '@/assets/landing/why-progress.svg'
import { ButtonLink } from '@/shared/ui/Button/ButtonLink'
import { MentorPreviewCard } from './MentorPreviewCard'
import styles from './LandingPage.module.css'

const STEPS = [
  { number: '01', icon: stepGoal, title: 'Расскажите о цели', text: 'Что вы хотите изменить или получить?' },
  {
    number: '02',
    icon: stepMatch,
    title: 'Получите подборку',
    text: 'ИИ анализирует профиль и подбирает максимально совместимых наставников.',
  },
  {
    number: '03',
    icon: stepResult,
    title: 'Двигайтесь к результату',
    text: 'Наставник и Куратор помогают превратить цель в конкретный план действий.',
  },
]

const REASONS = [
  {
    icon: whyGoal,
    title: 'Подбор под цель',
    text: 'Мы учитываем не только профессию, но и ваши конкретные задачи и мечты.',
  },
  { icon: whyAi, title: 'Объяснимый ИИ', text: 'Вы видите, почему система считает наставника подходящим.' },
  { icon: whyCurator, title: 'Человек-куратор', text: 'ИИ подбирает, а человек контролирует качество пары.' },
  { icon: whyProgress, title: 'Фокус на результате', text: 'Цели, встречи, задачи и прогресс - всё в одном месте.' },
]

const MENTOR_BADGES = [
  { icon: badgeSchedule, text: 'Гибкий график', className: styles.badgeSchedule },
  { icon: badgeIncome, text: 'От 5 000 ₽ в месяц и выше', className: styles.badgeIncome },
  { icon: badgeStudents, text: 'Мотивированные ученики', className: styles.badgeStudents },
]

export function HeroSection() {
  return (
    <section className={`${styles.container} ${styles.hero}`}>
      <div>
        <p className={styles.eyebrow}>платформа наставничества с AI</p>
        <h1 className={styles.heroTitle}>Найдите наставника, который подходит именно Вам</h1>
        <p className={styles.heroText}>
          Куратор анализирует ваши цели, интересы и опыт, чтобы подобрать подходящего наставника и помочь пройти путь
          от цели до результата!
        </p>
        <ButtonLink to="/register" className={`${styles.cta} ${styles.heroCta}`}>
          Начать подбор
        </ButtonLink>
        <p className={styles.heroNote}>бесплатно, займет 5 минут</p>
      </div>
      <MentorPreviewCard />
    </section>
  )
}

type SectionProps = {
  className?: string
}

export function HowItWorksSection({ className }: SectionProps) {
  return (
    <section className={[styles.container, styles.howItWorks, className].filter(Boolean).join(' ')}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>как работает?</p>
          <h2 className={`${styles.sectionTitle} ${styles.howTitle}`}>
            Всего 3 шага -<br />и вы на пути к цели
          </h2>
        </div>
        <p className={`${styles.sectionAside} ${styles.howAside}`}>
          Простой процесс, который экономит ваше время и помогает находить лучших наставников.
        </p>
      </div>
      <ol className={styles.steps}>
        {STEPS.map((step, index) => (
          <Fragment key={step.number}>
            {index > 0 && (
              <li className={styles.stepArrow} aria-hidden="true">
                <img src={arrowRight} alt="" width={47} height={45} />
              </li>
            )}
            <li className={`${styles.card} ${styles.step}`}>
              <img src={step.icon} alt="" width={80} height={80} />
              <p className={styles.stepNumber}>{step.number}</p>
              <h3 className={styles.cardTitle}>{step.title}</h3>
              <p className={styles.cardText}>{step.text}</p>
            </li>
          </Fragment>
        ))}
      </ol>
    </section>
  )
}

export function WhyKuratorSection() {
  return (
    <section className={`${styles.container} ${styles.why}`}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>почему Куратор?</p>
          <h2 className={`${styles.sectionTitle} ${styles.whyTitle}`}>Больше, чем просто список наставников</h2>
        </div>
        <p className={`${styles.sectionAside} ${styles.whyAside}`}>
          Мы используем ИИ, но в центре всегда человек. Куратор помогает найти не просто эксперта, а того, кто
          действительно подходит именно вам.
        </p>
      </div>
      <ul className={styles.whyGrid}>
        {REASONS.map((reason) => (
          <li key={reason.title} className={`${styles.card} ${styles.whyCard}`}>
            <img src={reason.icon} alt="" width={80} height={80} />
            <h3 className={styles.cardTitle}>{reason.title}</h3>
            <p className={styles.cardText}>{reason.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ForMentorsSection() {
  return (
    <section className={`${styles.container} ${styles.forMentors}`}>
      <div className={styles.forMentorsLead}>
        <p className={styles.eyebrow}>для наставников</p>
        <h2 className={`${styles.sectionTitle} ${styles.forMentorsTitle}`}>Делитесь опытом и зарабатывайте</h2>
        <p className={styles.forMentorsText}>
          Находите мотивированных учеников, которые подходят вам по целям и интересам.
          <br />
          Гибкий график, удобный формат, достойный доход.
        </p>
        <ButtonLink to="/register?role=mentor" className={`${styles.cta} ${styles.forMentorsCta}`}>
          Стать наставником
        </ButtonLink>
      </div>
      {/* Иллюстрация: фото наставника с плашками преимуществ */}
      <div className={styles.mentorArt}>
        <div className={styles.mentorLine1} aria-hidden="true">
          <img src={mentorLine1} alt="" />
        </div>
        <div className={styles.mentorLine2} aria-hidden="true">
          <img src={mentorLine2} alt="" />
        </div>
        <img className={styles.mentorBlob} src={mentorBlob} alt="" />
        <img className={styles.mentorPhoto} src={mentorPhoto} alt="" width={343} height={315} />
        <ul className={styles.badges}>
          {MENTOR_BADGES.map((badge) => (
            <li key={badge.text} className={`${styles.badge} ${badge.className}`}>
              <img src={badge.icon} alt="" width={28} height={28} />
              {badge.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
