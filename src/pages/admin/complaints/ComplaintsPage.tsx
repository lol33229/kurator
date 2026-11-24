import { useState } from 'react'
import { Link } from 'react-router'
import { Filters, PageTitle, PersonCell, Pill } from '../AdminParts'
import t from '../AdminTable.module.css'
import { COMPLAINT_STATUSES } from '../adminData'
import { useUsers } from '../users/usersStore'
import { useComplaints } from './complaintsStore'
import styles from './Complaints.module.css'

const FILTERS = ['Все', ...COMPLAINT_STATUSES] as const
type Filter = (typeof FILTERS)[number]

// Список жалоб с фильтром по статусу
export function ComplaintsPage() {
  const [filter, setFilter] = useState<Filter>('Все')
  const users = useUsers()
  const visible = useComplaints().filter((complaint) => filter === 'Все' || complaint.status === filter)

  return (
    <>
      <PageTitle title="Жалобы" subtitle="Обращения пользователей на нарушения" />
      <Filters label="Статус жалобы" options={FILTERS} value={filter} onChange={setFilter} className={styles.filters} />

      <div className={`${t.card} ${styles.card}`}>
        <table className={`${t.table} ${styles.table}`}>
          <thead>
            <tr>
              <th>На кого</th>
              <th>Роль</th>
              <th>Причина</th>
              <th>От кого</th>
              <th>Статус</th>
              <th>Дата</th>
              <th>
                <span className={t.hidden}>Действия</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((complaint) => {
              const user = users.find((item) => item.id === complaint.userId)
              if (!user) return null
              return (
                <tr key={complaint.id}>
                  <td className={styles.personCell}>
                    <PersonCell name={user.name} sub={user.email} color={user.color} />
                  </td>
                  <td className={styles.roleCell}>
                    <Pill>{user.role}</Pill>
                  </td>
                  <td className={styles.reasonCell}>{complaint.reason}</td>
                  <td className={styles.fromCell}>{complaint.from}</td>
                  <td className={styles.statusCell}>
                    <Pill>{complaint.status}</Pill>
                  </td>
                  <td className={styles.dateCell}>{complaint.date}</td>
                  <td className={styles.viewCell}>
                    <Link to={`/admin/complaints/${complaint.id}`} className={styles.view} aria-label={`Просмотр жалобы на ${user.name}`}>
                      Просмотр
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {visible.length === 0 && <p className={t.empty}>Жалоб с таким статусом нет</p>}
      </div>
    </>
  )
}
