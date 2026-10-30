import { Fragment } from 'react'
import arrowRight from '@/assets/landing/arrow-right.svg'
import circleLime from '@/assets/landing/circle-lime.svg'
import circleMint from '@/assets/landing/circle-mint.svg'
import circleOrange from '@/assets/landing/circle-orange.svg'
import circlePurple from '@/assets/landing/circle-purple.svg'
import { ButtonLink } from '@/shared/ui/Button/ButtonLink'
import { MentorPreviewCard } from './MentorPreviewCard'
import styles from './LandingPage.module.css'

// Тексты «ЗАГОЛОВОК» и «описание» — заглушки из макета, заменим, когда появится копирайт.
const STEPS = [
  { number: '01', icon: circlePurple, title: 'ЗАГОЛОВОК', text: 'описание' },
  { number: '02', icon: circleOrange, title: 'ЗАГОЛОВОК', text: 'описание' },
  { number: '03', icon: circleMint, title: 'ЗАГОЛОВОК', text: 'описание' },
]

const REASONS = [
  { icon: circleLime, title: 'ЗАГОЛОВОК', text: 'описание' },
  { icon: circleMint, title: 'ЗАГОЛОВОК', text: 'описание' },
  { icon: circleOrange, title: 'ЗАГОЛОВОК', text: 'описание' },
  { icon: circlePurple, title: 'ЗАГОЛОВОК', text: 'описание' },
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
        <ButtonLink to="/register" className={styles.heroCta}>
          Начать подбор
        </ButtonLink>
        <p className={styles.heroNote}>бесплатно, займет 5 минут</p>
      </div>
      <MentorPreviewCard />
    </section>
  )
}

export function HowItWorksSection() {
  return (
    <section className={`${styles.container} ${styles.howItWorks}`}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>как работает?</p>
          <h2 className={styles.sectionTitle}>ЗАГОЛОВОК</h2>
        </div>
        <p className={styles.sectionAside}>описание</p>
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
              <p className={`${styles.cardText} ${styles.stepNumber}`}>{step.number}</p>
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
      <p className={styles.eyebrow}>почему куратор</p>
      <h2 className={styles.sectionTitle}>ЗАГОЛОВОК</h2>
      <ul className={styles.whyGrid}>
        {REASONS.map((reason, index) => (
          <li key={index} className={`${styles.card} ${styles.whyCard}`}>
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
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>для наставников</p>
          <h2 className={styles.sectionTitle}>ЗАГОЛОВОК</h2>
        </div>
        <p className={styles.sectionAside}>описание</p>
      </div>
      <div className={styles.forMentorsBody}>
        <div className={styles.forMentorsLead}>
          <p className={styles.forMentorsText}>описание</p>
          <ButtonLink to="/register?role=mentor" className={styles.forMentorsCta}>
            СТАТЬ НАСТАВНИКОМ
          </ButtonLink>
        </div>
        <div className={`${styles.card} ${styles.benefitsCard}`}>наставник/ плюсы от платформы</div>
      </div>
    </section>
  )
}
