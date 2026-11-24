import { NavLink, Outlet, useNavigate } from 'react-router'
import logoutIcon from '@/assets/admin/logout.svg'
import { Logo } from '@/shared/ui/Logo/Logo'
import { Avatar } from './AdminParts'
import { CURATOR, NAV } from './adminData'
import styles from './AdminLayout.module.css'

// Панель куратора: меню слева и экран справа
export function AdminLayout() {
  const navigate = useNavigate()
  return (
    <div className={styles.layout}>
      <aside className={styles.aside}>
        <Logo className={styles.logo} />
        <p className={styles.caption}>Панель куратора</p>
        <nav className={styles.nav} aria-label="Разделы панели">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => [styles.link, isActive && styles.linkActive].filter(Boolean).join(' ')}
            >
              {item.label}
              {item.badge && <span className={[styles.badge, item.muted && styles.badgeMuted].filter(Boolean).join(' ')}>{item.badge}</span>}
            </NavLink>
          ))}
        </nav>
        <div className={styles.user}>
          <Avatar initials={CURATOR.initials} color={CURATOR.color} />
          <div className={styles.userText}>
            <p className={styles.userName}>{CURATOR.shortName}</p>
            <p className={styles.userRole}>куратор</p>
          </div>
          <button type="button" className={styles.logout} aria-label="Выйти" onClick={() => navigate('/')}>
            <img src={logoutIcon} alt="" width={20} height={20} />
          </button>
        </div>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
