import { useCallback, useState, type CSSProperties } from 'react'
import { useParams } from 'react-router'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { Toast } from '@/shared/ui/Toast/Toast'
import { Avatar, Crumbs, Pill } from '../AdminParts'
import partStyles from '../AdminParts.module.css'
import type { Pair } from '../adminData'
import { ContactModal, RematchModal } from './PairModals'
import styles from './Pair.module.css'
import { resolveAppeal, setPairStatus, usePairs } from './pairsStore'

const ROLES = { mentor: 'Ментор', mentee: 'Менти' } as const

type Contact = { person: Pair['mentor']; role: string }

// Карточка пары: участники, статус, обращения и совместимость
export function PairPage() {
  const { id } = useParams()
  const pair = usePairs().find((item) => item.id === id)
  const [contact, setContact] = useState<Contact | null>(null)
  const [rematch, setRematch] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const hideToast = useCallback(() => setToast(null), [setToast])

  if (!pair) return <PagePlaceholder title="Пара не найдена" />

  const closed = pair.status === 'Повторный подбор' || pair.status === 'Завершена'
  const members = [
    { key: 'mentor', person: pair.mentor, role: ROLES.mentor },
    { key: 'mentee', person: pair.mentee, role: ROLES.mentee },
  ]

  const startRematch = () => {
    setPairStatus(pair.id, 'Повторный подбор')
    setRematch(false)
    setToast('Повторный подбор запущен')
  }

  return (
    <>
      <Crumbs to="/admin/pairs" label="Подбор пар" current={`Пара #${pair.number}`} />

      <div className={styles.head}>
        <header>
          <h1 className={partStyles.title}>{pair.names}</h1>
          <p className={partStyles.subtitle}>
            Цель: {pair.goal} · с {pair.started}
          </p>
        </header>
        <button type="button" className={styles.rematch} disabled={closed} onClick={() => setRematch(true)}>
          {pair.status === 'Повторный подбор' ? 'Повторный подбор запущен' : 'Инициировать повторный подбор'}
        </button>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <section className={styles.card} aria-labelledby="pair-members">
            <h2 id="pair-members" className={styles.cardTitle}>
              Участники
            </h2>
            <ul className={styles.list}>
              {members.map(({ key, person, role }) => (
                <li key={key} className={styles.member}>
                  <span className={styles.bigAvatar} style={{ background: person.color }} aria-hidden="true">
                    {person.initials}
                  </span>
                  <div className={styles.memberInfo}>
                    <p className={styles.memberRole}>{role}</p>
                    <p className={styles.memberName}>{person.name}</p>
                    <p className={styles.memberRole}>{person.email}</p>
                  </div>
                  <button
                    type="button"
                    className={styles.contact}
                    aria-label={`Связаться: ${person.name}`}
                    onClick={() => setContact({ person, role })}
                  >
                    Связаться
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.card} aria-labelledby="pair-status">
            <h2 id="pair-status" className={styles.cardTitle}>
              Статус
            </h2>
            <dl className={styles.data}>
              <div className={styles.item}>
                <dt className={styles.label}>Статус пары</dt>
                <dd className={styles.value}>
                  <Pill>{pair.status}</Pill>
                </dd>
              </div>
              <div className={styles.item}>
                <dt className={styles.label}>Прогресс цели</dt>
                <dd className={styles.value}>{pair.progress}%</dd>
              </div>
              <div className={styles.item}>
                <dt className={styles.label}>Встреч проведено</dt>
                <dd className={styles.value}>{pair.meetings}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.card} aria-labelledby="pair-appeals">
            <h2 id="pair-appeals" className={styles.cardTitle}>
              Обращения участников
            </h2>
            {pair.appeals.length > 0 ? (
              <ul className={`${styles.list} ${styles.appeals}`}>
                {pair.appeals.map((appeal) => {
                  const person = pair[appeal.from]
                  const role = ROLES[appeal.from]
                  return (
                    <li key={appeal.id} className={styles.appeal}>
                      <div className={styles.appealHead}>
                        <Avatar initials={person.initials} color={person.color} />
                        <div className={styles.memberInfo}>
                          <p className={styles.appealName}>{person.name}</p>
                          <p className={styles.appealMeta}>
                            {role} · {appeal.date}
                          </p>
                        </div>
                        <Pill>{appeal.status}</Pill>
                      </div>
                      <p className={styles.appealText}>{appeal.text}</p>
                      {appeal.status === 'Новое' && (
                        <div className={styles.appealActions}>
                          <button type="button" className={styles.reply} onClick={() => setContact({ person, role })}>
                            Ответить
                          </button>
                          <button
                            type="button"
                            className={styles.resolve}
                            onClick={() => {
                              resolveAppeal(pair.id, appeal.id)
                              setToast('Обращение закрыто')
                            }}
                          >
                            Отметить решённым
                          </button>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className={styles.empty}>Обращений нет</p>
            )}
          </section>
        </div>

        <section className={`${styles.card} ${styles.compat}`} aria-labelledby="pair-compat">
          <h2 id="pair-compat" className={styles.compatTitle}>
            Совместимость
          </h2>
          <div className={styles.ring} style={{ '--value': `${pair.compatibility ?? 0}%` } as CSSProperties}>
            <span className={styles.ringValue}>{pair.compatibility === null ? '—' : `${pair.compatibility}%`}</span>
          </div>
          <p className={styles.factorsTitle}>Факторы совместимости</p>
          <ul className={styles.factors}>
            {pair.factors.map((factor) => (
              <li key={factor.label}>
                <div className={styles.factorHead}>
                  <span>{factor.label}</span>
                  <b>{factor.value}%</b>
                </div>
                <span className={styles.factorTrack} aria-hidden="true">
                  <span className={`${styles.factorFill} ${factor.value < 50 ? styles.low : ''}`} style={{ width: `${factor.value}%` }} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {contact && (
        <ContactModal
          person={contact.person}
          role={contact.role}
          onSend={() => {
            setContact(null)
            setToast('Сообщение отправлено в чат')
          }}
          onClose={() => setContact(null)}
        />
      )}
      {rematch && <RematchModal onConfirm={startRematch} onClose={() => setRematch(false)} />}
      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
