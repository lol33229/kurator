import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import chevronIcon from '@/assets/icons/chevron-wide.svg'
import { Logo } from '@/shared/ui/Logo/Logo'
import styles from './UserHeader.module.css'

type UserHeaderProps = {
  name: string
  roleLabel: string
  avatar: string
  // Разделы с непрочитанным: у ссылки появляется зелёная точка
  unread?: string[]
}

const NAV_LINKS = [
  { to: '/mentors', label: 'Менторы' },
  { to: '/news', label: 'Новости' },
  { to: '/messages', label: 'Сообщения' },
  { to: '/notifications', label: 'Уведомления' },
]

// Шапка для вошедшего пользователя
export function UserHeader({ name, roleLabel, avatar, unread = [] }: UserHeaderProps) {
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <header className={styles.header}>
      <Logo className={styles.logo} />
      <nav className={styles.nav} aria-label="Разделы">
        {NAV_LINKS.map((link) => {
          const hasUnread = unread.includes(link.to)
          return (
            <Link key={link.to} to={link.to} className={hasUnread ? styles.unread : undefined}>
              {link.label}
              {hasUnread && <span className={styles.hidden}> (есть непрочитанные)</span>}
            </Link>
          )
        })}
      </nav>
      <div ref={rootRef} className={styles.profile}>
        <button
          type="button"
          className={styles.profileButton}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen(!open)}
        >
          <img className={styles.avatar} src={avatar} alt="" width={50} height={50} />
          <span className={styles.identity}>
            <span className={styles.name}>{name}</span>
            <span className={styles.role}>{roleLabel}</span>
          </span>
          <img className={[styles.chevron, open && styles.chevronOpen].filter(Boolean).join(' ')} src={chevronIcon} alt="" width={23} height={24} />
        </button>
        {open && (
          <ul id={menuId} className={styles.menu} role="menu">
            <li role="none">
              <Link role="menuitem" to="/profile" onClick={() => setOpen(false)}>
                Профиль
              </Link>
            </li>
            <li role="none">
              <Link role="menuitem" to="/settings" onClick={() => setOpen(false)}>
                Настройки
              </Link>
            </li>
            <li role="none">
              {/* Пока нет API: выход ведёт на лендинг */}
              <Link role="menuitem" to="/" className={styles.logout}>
                Выйти
              </Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  )
}
