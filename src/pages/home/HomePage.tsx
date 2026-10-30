import { LandingFooter } from '@/pages/landing/LandingFooter'
import { LandingHeader } from '@/pages/landing/LandingHeader'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { ForMentorsSection, HowItWorksSection, WhyKuratorSection } from '@/pages/landing/LandingSections'
import { ButtonLink } from '@/shared/ui/Button/ButtonLink'
import { ChatbotButton } from '@/shared/ui/ChatbotButton/ChatbotButton'
import { RecommendationCard, type Recommendation } from './RecommendationCard'
import styles from './HomePage.module.css'

// Моковые данные, пока нет API рекомендаций.
const TOP_RECOMMENDATION: Recommendation = {
  compatibility: 94,
  displayName: 'Алексей С.',
  direction: 'Data Science',
  tags: ['Python', 'ML', 'SQL', 'Data Analysis'],
  reasons: [
    '7 лет опыта в ML и анализе данных',
    'Совпадает график (вечернее время)',
    'Общие профессиональные интересы',
  ],
  profilePath: '/mentors',
}

export function HomePage() {
  return (
    <div className={landingStyles.page}>
      <LandingHeader cabinetPath="/student" />
      <main>
        <section className={`${landingStyles.container} ${styles.hero}`}>
          <div className={styles.heroLead}>
            <p className={landingStyles.eyebrow}>платформа наставничества с AI</p>
            <h1 className={styles.heroTitle}>Ваш подбор готов</h1>
            <p className={styles.heroText}>Наставники, которые подходят вам больше всего</p>
            <ButtonLink to="/student" className={styles.heroCta}>
              НАЧАТЬ ПОДБОР
            </ButtonLink>
            <p className={styles.heroNote}>бесплатно, займет 5 минут</p>
          </div>
          <RecommendationCard recommendation={TOP_RECOMMENDATION} />
          <ChatbotButton className={styles.chatbot} />
        </section>
        <HowItWorksSection className={styles.howItWorks} />
        <WhyKuratorSection />
        <ForMentorsSection />
      </main>
      <LandingFooter />
    </div>
  )
}
