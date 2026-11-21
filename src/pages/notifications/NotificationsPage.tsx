import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import botIcon from '@/assets/notifications/bot.svg'
import calendarIcon from '@/assets/notifications/calendar.svg'
import chartPieIcon from '@/assets/notifications/chart-pie.svg'
import checkIcon from '@/assets/notifications/check.svg'
import fileIcon from '@/assets/notifications/file.svg'
import planeIcon from '@/assets/notifications/plane.svg'
import rocketIcon from '@/assets/notifications/rocket.svg'
import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { plural } from '@/pages/mentors/data'
import { STUDENT } from '@/pages/student/data'
import { Toast } from '@/shared/ui/Toast/Toast'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import {
  CATEGORY_TABS,
  NOTIFICATIONS,
  type AppNotification,
  type NotificationAction,
  type NotificationIcon,
  type RichText,
} from './notificationsData'
import styles from './Notifications.module.css'

const ICONS: Record<NotificationIcon, string> = {
  check: checkIcon,
  calendar: calendarIcon,
  plane: planeIcon,
  rocket: rocketIcon,
  chartPie: chartPieIcon,
  bot: botIcon,
  file: fileIcon,
}

type Tab = (typeof CATEGORY_TABS)[number]['value']

function Rich({ parts }: { parts: RichText }) {
  return parts.map((part, index) => (index % 2 === 1 ? <b key={index}>{part}</b> : part))
}

const unreadLabel = (count: number) =>
  `У вас ${count} ${plural(count, 'непрочитанное уведомление', 'непрочитанных уведомления', 'непрочитанных уведомлений')}`

// Уведомления
export function NotificationsPage() {
  const [items, setItems] = useState(NOTIFICATIONS)
  const [tab, setTab] = useState<Tab>('all')
  const [enabled, setEnabled] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const hideToast = useCallback(() => setToast(null), [])

  const unreadCount = items.filter((item) => item.unread).length
  const countFor = (value: Tab) =>
    value === 'all' ? items.length : value === 'unread' ? unreadCount : items.filter((item) => item.category === value).length
  const visible = items.filter((item) => tab === 'all' || (tab === 'unread' ? item.unread : item.category === tab))
  const groups = [...new Set(visible.map((item) => item.group))]

  const update = (id: string, change: Partial<AppNotification>) =>
    setItems((list) => list.map((item) => (item.id === id ? { ...item, ...change } : item)))

  const markAllRead = () => {
    setItems((list) => list.map((item) => ({ ...item, unread: false })))
    setToast('Все уведомления прочитаны')
  }

  const runEffect = (item: AppNotification, action: Extract<NotificationAction, { effect: string }>) => {
    if (action.effect === 'acceptMeeting') {
      update(item.id, { title: [item.title[0], item.title[1], ' — встреча подтверждена'], tone: 'green', actions: [], unread: false })
      setToast('Встреча добавлена в календарь')
    } else {
      update(item.id, { title: ['Вы отклонили приглашение: ', item.title[1]], actions: [], unread: false })
    }
  }

  return (
    <div className={`${landingStyles.page} ${styles.page}`}>
      <UserHeader name={STUDENT.shortName} roleLabel="менти" avatar={STUDENT.avatar} profilePath="/student/profile" />
      <main className={styles.main}>
        <div className={styles.head}>
          <div>
            <h1 className={styles.title}>Уведомления</h1>
            <p className={styles.subtitle} aria-live="polite">
              {unreadCount > 0 ? unreadLabel(unreadCount) : 'Все уведомления прочитаны'}
            </p>
          </div>
          <div className={styles.controls}>
            {unreadCount > 0 && (
              <button type="button" className={styles.markAll} onClick={markAllRead}>
                ✓ Отметить все прочитанными
              </button>
            )}
            <label className={styles.toggleRow}>
              Включить/выключить уведомления
              <button
                type="button"
                role="switch"
                aria-checked={enabled}
                className={styles.switch}
                onClick={() => setEnabled(!enabled)}
              >
                <span className={styles.switchThumb} />
              </button>
            </label>
          </div>
        </div>

        <section className={styles.section}>
          <div className={styles.tabs} role="tablist" aria-label="Фильтр уведомлений">
            {CATEGORY_TABS.map((item) => {
              const count = countFor(item.value)
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.value}
                  className={[styles.tab, tab === item.value && styles.tabActive].filter(Boolean).join(' ')}
                  onClick={() => setTab(item.value)}
                >
                  {item.label}
                  {count > 0 && <span className={styles.tabCount}>{count}</span>}
                </button>
              )
            })}
          </div>

          <div className={styles.list} role="tabpanel">
            {groups.length === 0 && <p className={styles.empty}>Здесь пока пусто</p>}
            {groups.map((group) => (
              <div key={group} className={styles.group}>
                <h2 className={styles.groupTitle}>{group}</h2>
                <ul className={styles.items}>
                  {visible
                    .filter((item) => item.group === group)
                    .map((item) => (
                      <li key={item.id} className={[styles.item, item.unread && styles.unread].filter(Boolean).join(' ')}>
                        <span className={`${styles.icon} ${styles[item.tone]}`}>
                          <img src={ICONS[item.icon]} alt="" width={20} height={20} />
                        </span>
                        <div className={styles.body}>
                          <p className={styles.itemTitle}>
                            {item.unread && <span className={styles.hidden}>Новое: </span>}
                            <Rich parts={item.title} />
                          </p>
                          <p className={styles.itemText}>{item.text}</p>
                          {item.actions.length > 0 && (
                            <div className={styles.actions}>
                              {item.actions.map((action) => {
                                const className = `${styles.action} ${action.primary ? styles.primary : styles.secondary}`
                                return 'to' in action ? (
                                  <Link key={action.label} to={action.to} className={className} onClick={() => update(item.id, { unread: false })}>
                                    {action.label}
                                  </Link>
                                ) : (
                                  <button key={action.label} type="button" className={className} onClick={() => runEffect(item, action)}>
                                    {action.label}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                        <span className={styles.time}>{item.time}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <LandingFooter />
      {toast && <Toast message={toast} onHide={hideToast} />}
    </div>
  )
}
