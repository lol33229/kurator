import { Link } from 'react-router'
import { Logo } from '@/shared/ui/Logo/Logo'
import styles from './LandingPage.module.css'

const SUPPORT_EMAIL = 'aaa@mail.ru'

export function LandingFooter() {
  return (
    <footer className={`${styles.container} ${styles.card} ${styles.footer}`}>
      <div>
        <Logo size="lg" className={styles.footerLogo} />
        <p className={styles.footerTagline}>платформа наставничества с AI</p>
      </div>
      <nav className={styles.footerLinks} aria-label="Ссылки в подвале">
        <Link to="/news">новости</Link>
        <Link to="/mentors">менторы</Link>
        <div className={styles.support}>
          техническая поддержка:
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </div>
      </nav>
    </footer>
  )
}
