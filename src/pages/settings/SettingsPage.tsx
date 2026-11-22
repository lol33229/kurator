import { useCallback, useId, useState } from 'react'
import { useNavigate } from 'react-router'
import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { STUDENT } from '@/pages/student/data'
import { Toast } from '@/shared/ui/Toast/Toast'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import { AccountForm, type Account } from './AccountForm'
import styles from './Settings.module.css'

// Моковые настройки, пока нет API
const TOPICS = [
  { id: 'requests', title: 'Заявки', text: 'Ответы наставников на ваши заявки', on: true },
  { id: 'meetings', title: 'Встречи', text: 'Приглашения и напоминания за 1 час до начала', on: true },
  { id: 'messages', title: 'Сообщения', text: 'Новые сообщения в чатах', on: true },
  { id: 'recommendations', title: 'Рекомендации', text: 'Новые подходящие наставники', on: true },
  { id: 'news', title: 'Новости платформы', text: 'Вебинары, обновления, события', on: false },
]

const CHANNELS = [
  { id: 'site', label: 'На сайте', on: true },
  { id: 'email', label: 'Email', on: true },
  { id: 'telegram', label: 'Telegram', on: false },
]

const ACCOUNT: Account = { email: 'alex.smirnov@mail.ru', passwordChanged: '2 ноября 2026' }

function Switch({ checked, onChange, labelledBy }: { checked: boolean; onChange: () => void; labelledBy: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-labelledby={labelledBy} className={styles.switch} onClick={onChange}>
      <span className={styles.thumb} />
    </button>
  )
}

// Настройки
export function SettingsPage() {
  const id = useId()
  const navigate = useNavigate()
  const [topics, setTopics] = useState(TOPICS)
  const [channels, setChannels] = useState(CHANNELS)
  // Что было включено до общего выключения, чтобы вернуть как было
  const [saved, setSaved] = useState<typeof TOPICS | null>(null)
  const [account, setAccount] = useState(ACCOUNT)
  const [editing, setEditing] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const hideToast = useCallback(() => setToast(null), [])
  const allOn = topics.some((topic) => topic.on)

  const toggleTopic = (topicId: string) => {
    setSaved(null)
    setTopics((list) => list.map((topic) => (topic.id === topicId ? { ...topic, on: !topic.on } : topic)))
  }
  // Общий переключатель выключает всё разом, а при включении возвращает прежний выбор
  const toggleAll = () => {
    if (allOn) {
      setSaved(topics)
      setTopics(topics.map((topic) => ({ ...topic, on: false })))
    } else {
      setTopics(saved ?? topics.map((topic) => ({ ...topic, on: true })))
      setSaved(null)
    }
  }
  const toggleChannel = (channelId: string) =>
    setChannels((list) => list.map((channel) => (channel.id === channelId ? { ...channel, on: !channel.on } : channel)))

  return (
    <div className={`${landingStyles.page} ${styles.page}`}>
      <UserHeader name={STUDENT.shortName} roleLabel="менти" avatar={STUDENT.avatar} profilePath="/student/profile" />
      <main className={styles.main}>
        <h1 className={styles.title}>Настройки</h1>
        <p className={styles.subtitle}>Управляйте уведомлениями и данными для входа</p>

        <section className={styles.card} aria-labelledby={`${id}-notifications`}>
          <h2 id={`${id}-notifications`} className={styles.cardTitle}>
            Уведомления
          </h2>
          <p className={styles.cardText}>Включите или выключите уведомления, которые хотите получать.</p>

          <div className={styles.master}>
            <div>
              <p id={`${id}-all`} className={styles.rowTitle}>
                Все уведомления
              </p>
              <p className={styles.masterText}>Быстро выключить всё разом</p>
            </div>
            <Switch checked={allOn} onChange={toggleAll} labelledBy={`${id}-all`} />
          </div>

          <ul className={styles.rows}>
            {topics.map((topic) => (
              <li key={topic.id} className={styles.row}>
                <div>
                  <p id={`${id}-${topic.id}`} className={styles.rowTitle}>
                    {topic.title}
                  </p>
                  <p className={styles.rowText}>{topic.text}</p>
                </div>
                <Switch checked={topic.on} onChange={() => toggleTopic(topic.id)} labelledBy={`${id}-${topic.id}`} />
              </li>
            ))}
          </ul>

          <div className={styles.channelsBlock}>
            <p id={`${id}-channels`} className={styles.rowTitle}>
              Куда присылать
            </p>
            <div className={styles.channels} role="group" aria-labelledby={`${id}-channels`}>
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  type="button"
                  aria-pressed={channel.on}
                  className={[styles.channel, channel.on && styles.channelOn].filter(Boolean).join(' ')}
                  onClick={() => toggleChannel(channel.id)}
                >
                  {channel.on && <span aria-hidden="true">✓ </span>}
                  {channel.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.card} ${styles.account}`} aria-labelledby={`${id}-account`}>
          <div className={styles.accountHead}>
            <div>
              <h2 id={`${id}-account`} className={styles.cardTitle}>
                Личные данные
              </h2>
              <p className={styles.cardText}>
                {editing ? 'Измените почту или пароль. Для подтверждения введите текущий пароль.' : 'Данные для входа в аккаунт.'}
              </p>
            </div>
            {!editing && (
              <button type="button" className={styles.edit} onClick={() => setEditing(true)}>
                Изменить
              </button>
            )}
          </div>
          {editing ? (
            <AccountForm
              account={account}
              onCancel={() => setEditing(false)}
              onSave={(next) => {
                setAccount(next)
                setEditing(false)
                setToast('Данные сохранены')
              }}
            />
          ) : (
            <dl className={styles.fields}>
              <div>
                <dt>Почта</dt>
                <dd>{account.email}</dd>
              </div>
              <div>
                <dt>Пароль</dt>
                <dd>
                  <span aria-hidden="true">••••••••••</span>
                  <span className={styles.hidden}>скрыт</span>
                </dd>
                <dd className={styles.fieldNote}>Изменён {account.passwordChanged}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className={`${styles.card} ${styles.logout}`}>
          <div>
            <h2 className={styles.logoutTitle}>Выйти из аккаунта</h2>
            <p className={styles.logoutText}>Вы выйдете на этом устройстве. Данные и переписка сохранятся.</p>
          </div>
          {/* Пока нет API: выход ведёт на лендинг */}
          <button type="button" className={styles.logoutButton} onClick={() => navigate('/')}>
            Выйти
          </button>
        </section>
      </main>
      <LandingFooter />
      {toast && <Toast message={toast} onHide={hideToast} />}
    </div>
  )
}
