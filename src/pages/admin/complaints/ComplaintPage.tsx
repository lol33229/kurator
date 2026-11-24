import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router'
import chevronIcon from '@/assets/admin/chevron.svg'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { Toast } from '@/shared/ui/Toast/Toast'
import { Crumbs, Pill } from '../AdminParts'
import partStyles from '../AdminParts.module.css'
import { COMPLAINT_STATUSES, initials, type ComplaintStatus } from '../adminData'
import { useUsers } from '../users/usersStore'
import styles from './Complaint.module.css'
import { setComplaintStatus, useComplaints } from './complaintsStore'

// Карточка жалобы: на кого, комментарий и смена статуса
export function ComplaintPage() {
  const { id } = useParams()
  const complaint = useComplaints().find((item) => item.id === id)
  const user = useUsers().find((item) => item.id === complaint?.userId)
  const [toast, setToast] = useState<string | null>(null)
  const hideToast = useCallback(() => setToast(null), [])

  if (!complaint || !user) return <PagePlaceholder title="Жалоба не найдена" />

  const title = `Жалоба #${complaint.number}`

  const changeStatus = (status: ComplaintStatus) => {
    setComplaintStatus(complaint.id, status)
    setToast(status === 'Решена' ? 'Обращение закрыто' : 'Статус жалобы обновлён')
  }

  return (
    <>
      <Crumbs to="/admin/complaints" label="Жалобы" current={title} />

      <div className={styles.head}>
        <header>
          <h1 className={partStyles.title}>{title}</h1>
          <p className={partStyles.subtitle}>{complaint.reason}</p>
        </header>
        <Link to={`/admin/users/${user.id}`} state={{ complaintId: complaint.id }} className={styles.goTo}>
          Перейти к пользователю
        </Link>
      </div>

      <div className={styles.grid}>
        <div className={styles.main}>
          <section className={`${styles.card} ${styles.userCard}`} aria-labelledby="complaint-user">
            <h2 id="complaint-user" className={styles.cardTitle}>
              Пользователь и роль
            </h2>
            <div className={styles.user}>
              <span className={styles.avatar} style={{ background: user.color }} aria-hidden="true">
                {initials(user.name)}
              </span>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{user.name}</p>
                <p className={styles.userEmail}>{user.email}</p>
                <div className={styles.pills}>
                  <Pill>{user.role}</Pill>
                  <Pill>{user.status}</Pill>
                </div>
              </div>
            </div>
          </section>

          <section className={`${styles.card} ${styles.commentCard}`} aria-labelledby="complaint-comment">
            <h2 id="complaint-comment" className={styles.cardTitle}>
              Комментарий
            </h2>
            <blockquote className={styles.quote}>«{complaint.comment}»</blockquote>
            <p className={styles.author}>
              Автор жалобы: {complaint.from} ({complaint.fromRole})
            </p>
          </section>
        </div>

        <section className={`${styles.card} ${styles.details}`} aria-labelledby="complaint-details">
          <h2 id="complaint-details" className={styles.detailsTitle}>
            Детали
          </h2>
          <dl className={styles.list}>
            <div className={styles.item}>
              <dt className={styles.label}>
                <label htmlFor="complaint-status">Статус</label>
              </dt>
              <dd className={styles.selectWrap}>
                <select
                  id="complaint-status"
                  className={styles.select}
                  value={complaint.status}
                  onChange={(event) => changeStatus(event.target.value as ComplaintStatus)}
                >
                  {COMPLAINT_STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
                <img src={chevronIcon} alt="" width={18} height={16} className={styles.chevron} />
              </dd>
            </div>
            <div className={styles.item}>
              <dt className={styles.label}>Дата</dt>
              <dd className={styles.value}>{complaint.date}</dd>
            </div>
            <div className={styles.item}>
              <dt className={styles.label}>Причина</dt>
              <dd className={styles.value}>{complaint.reason}</dd>
            </div>
          </dl>
        </section>
      </div>

      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
