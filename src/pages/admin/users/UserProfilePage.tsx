import { useCallback, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { Toast } from '@/shared/ui/Toast/Toast'
import { Avatar, Crumbs, Pill } from '../AdminParts'
import partStyles from '../AdminParts.module.css'
import { initials, WARNINGS_LIMIT } from '../adminData'
import { useComplaints } from '../complaints/complaintsStore'
import { usePairs } from '../pairs/pairsStore'
import { BlockUserModal, WarningModal } from './UserModals'
import styles from './UserProfile.module.css'
import { updateUser, useUsers } from './usersStore'

type Dialog = 'block' | 'warning' | null

// Профиль пользователя для куратора: данные, жалобы, пары и действия
export function UserProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const complaintId = (useLocation().state as { complaintId?: string } | null)?.complaintId
  const user = useUsers().find((item) => item.id === id)
  const complaints = useComplaints()
  const allPairs = usePairs()
  const [dialog, setDialog] = useState<Dialog>(null)
  const [toast, setToast] = useState<string | null>(null)
  const hideToast = useCallback(() => setToast(null), [setToast])

  if (!user) return <PagePlaceholder title="Пользователь не найден" />

  const blocked = user.status === 'Заблокирован'
  const warnings = user.warnings ?? 0
  const userComplaints = complaints.filter((complaint) => complaint.userId === user.id)
  const pairs = allPairs.filter((pair) => pair.mentorId === user.id || pair.menteeId === user.id)
  const fromComplaint = complaints.find((complaint) => complaint.id === complaintId)

  const block = () => {
    updateUser(user.id, { status: 'Заблокирован' })
    setToast('Пользователь заблокирован')
    setDialog(null)
  }

  const sendWarning = () => {
    const count = warnings + 1
    const autoBlock = count >= WARNINGS_LIMIT && !blocked
    updateUser(user.id, autoBlock ? { warnings: count, status: 'Заблокирован' } : { warnings: count })
    setToast(autoBlock ? 'Предупреждение отправлено, аккаунт заблокирован' : 'Предупреждение отправлено')
    setDialog(null)
  }

  return (
    <>
      {fromComplaint ? (
        <Crumbs to={`/admin/complaints/${fromComplaint.id}`} label={`Жалоба #${fromComplaint.number}`} current="Профиль" />
      ) : (
        <Crumbs to="/admin/users" label="Пользователи" current="Профиль" />
      )}

      <header className={styles.head}>
        <span className={styles.avatar} style={{ background: user.color }} aria-hidden="true">
          {initials(user.name)}
        </span>
        <div className={styles.headInfo}>
          <h1 className={partStyles.title}>{user.name}</h1>
          <div className={styles.pills}>
            <Pill>{user.role}</Pill>
            <Pill>{user.status}</Pill>
            {warnings > 0 && <Pill tone="warning">{`⚠ ${warnings} предупр.`}</Pill>}
          </div>
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.main}>
          <section className={styles.card} aria-labelledby="profile-data">
            <h2 id="profile-data" className={styles.cardTitle}>
              Данные профиля
            </h2>
            <dl className={styles.data}>
              <div className={styles.item}>
                <dt className={styles.label}>Email</dt>
                <dd className={styles.value}>{user.email}</dd>
              </div>
              <div className={styles.item}>
                <dt className={styles.label}>Город</dt>
                <dd className={styles.value}>{user.city || '—'}</dd>
              </div>
              <div className={styles.item}>
                <dt className={styles.label}>Регистрация</dt>
                <dd className={styles.value}>{user.registered}</dd>
              </div>
            </dl>
          </section>

          <section className={styles.card} aria-labelledby="profile-complaints">
            <h2 id="profile-complaints" className={styles.cardTitle}>
              Жалобы на пользователя
            </h2>
            {userComplaints.length > 0 ? (
              <ul className={styles.list}>
                {userComplaints.map((complaint) => (
                  <li key={complaint.id} className={styles.row}>
                    <div className={styles.rowText}>
                      <p className={styles.rowTitle}>{complaint.reason}</p>
                      <p className={styles.rowMeta}>
                        {complaint.date} · от {complaint.from}
                      </p>
                    </div>
                    <Pill>{complaint.status}</Pill>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>Жалоб нет</p>
            )}
          </section>

          <section className={styles.card} aria-labelledby="profile-pairs">
            <h2 id="profile-pairs" className={styles.cardTitle}>
              Пары
            </h2>
            {pairs.length > 0 ? (
              <ul className={styles.list}>
                {pairs.map((pair) => (
                  <li key={pair.id} className={`${styles.row} ${styles.pair}`}>
                    <div className={styles.pairInfo}>
                      <span className={styles.pairAvatars}>
                        <Avatar {...pair.mentor} />
                        <span className={styles.arrow} aria-hidden="true">
                          {'↔︎'}
                        </span>
                        <Avatar {...pair.mentee} />
                      </span>
                      <div className={styles.rowText}>
                        <p className={styles.rowTitle}>{pair.names}</p>
                        <p className={styles.pairGoal}>{pair.goal}</p>
                      </div>
                    </div>
                    <Pill>{pair.status}</Pill>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.empty}>Активных пар нет</p>
            )}
          </section>
        </div>

        <section className={`${styles.card} ${styles.actions}`} aria-labelledby="profile-actions">
          <h2 id="profile-actions" className={styles.cardTitle}>
            Действия
          </h2>
          <div className={styles.buttons}>
            {blocked ? (
              <button
                type="button"
                className={`${styles.button} ${styles.danger}`}
                onClick={() => {
                  updateUser(user.id, { status: 'Активен' })
                  setToast('Пользователь разблокирован')
                }}
              >
                Разблокировать
              </button>
            ) : (
              <button type="button" className={`${styles.button} ${styles.danger}`} onClick={() => setDialog('block')}>
                Заблокировать
              </button>
            )}
            <button type="button" className={styles.button} onClick={() => setDialog('warning')}>
              Отправить предупреждение
            </button>
            <button type="button" className={`${styles.button} ${styles.back}`} onClick={() => navigate(-1)}>
              Назад
            </button>
          </div>
        </section>
      </div>

      {dialog === 'block' && <BlockUserModal name={user.name} onConfirm={block} onClose={() => setDialog(null)} />}
      {dialog === 'warning' && <WarningModal name={user.name} warnings={warnings} onSend={sendWarning} onClose={() => setDialog(null)} />}
      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
