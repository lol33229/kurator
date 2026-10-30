import { LandingFooter } from './LandingFooter'
import { LandingHeader } from './LandingHeader'
import { ForMentorsSection, HeroSection, HowItWorksSection, WhyKuratorSection } from './LandingSections'
import styles from './LandingPage.module.css'

export function LandingPage() {
  return (
    <div className={styles.page}>
      <LandingHeader />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <WhyKuratorSection />
        <ForMentorsSection />
      </main>
      <LandingFooter />
    </div>
  )
}
