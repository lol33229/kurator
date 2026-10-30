import { Link } from 'react-router'
import { Logo } from '@/shared/ui/Logo/Logo'
import styles from './LandingPage.module.css'

type LandingHeaderProps = {
  // Есть у вошедшего пользователя: вместо «Войти / Регистрация» показываем кабинет и выход.
  cabinetPath?: string
}

export function LandingHeader({ cabinetPath }: LandingHeaderProps) {
  return (
    <header className={`${styles.container} ${styles.header}`}>
      <Logo className={styles.headerLogo} />
      <nav className={styles.headerNav} aria-label="Разделы">
        <Link to="/mentors">Менторы</Link>
        <Link to="/news">Новости</Link>
      </nav>
      <nav className={styles.authNav} aria-label="Аккаунт">
        {cabinetPath ? (
          <>
            <Link to={cabinetPath}>Кабинет</Link>
            <Link to="/">Выйти</Link>
          </>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
      </nav>
    </header>
  )
}
