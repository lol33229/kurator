import { NavLink, Outlet, useNavigate } from 'react-router'
import logoutIcon from '@/assets/admin/logout.svg'
import { Logo } from '@/shared/ui/Logo/Logo'
import { Avatar } from './AdminParts'
import { CURATOR, NAV } from './adminData'
import styles from './AdminLayout.module.css'
import { useChats } from './bot/botStore'

// Панель куратора: меню слева и экран справа
export function AdminLayout() {
  const navigate = useNavigate()
  // На «ИИ-бот» — сколько диалогов ждут оператора
  const waiting = useChats().filter((chat) => chat.status === 'Ждёт оператора').length
  return (
    <div className={styles.layout}>
      <aside className={styles.aside}>
        <Logo className={styles.logo} />
        <p className={styles.caption}>Панель куратора</p>
        <nav className={styles.nav} aria-label="Разделы панели">
          {NAV.map((item) => {
            const badge = item.to === '/admin/bot' ? waiting : item.badge
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => [styles.link, isActive && styles.linkActive].filter(Boolean).join(' ')}
              >
                {item.label}
                {badge ? <span className={[styles.badge, item.muted && styles.badgeMuted].filter(Boolean).join(' ')}>{badge}</span> : null}
              </NavLink>
            )
          })}
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
