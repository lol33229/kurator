import { Link } from 'react-router'
import { Avatar, PageTitle, Pill } from '../AdminParts'
import { CURATOR, initials, STATS } from '../adminData'
import { usePairs } from '../pairs/pairsStore'
import { useUsers } from '../users/usersStore'
import { useChats } from '../bot/botStore'
import { useComplaints } from '../complaints/complaintsStore'
import styles from './Dashboard.module.css'

const TONES = { up: styles.up, alert: styles.alert, muted: styles.muted }

// Дата сводки — день открытия страницы
const today = new Date().toLocaleDateString('ru-RU')

// Главная панели куратора: сводка, пары и жалобы
export function DashboardPage() {
  const complaints = useComplaints()
  const users = useUsers()
  const waiting = useChats().filter((chat) => chat.status === 'Ждёт оператора').length
  // На главной только текущие пары
  const pairs = usePairs().filter((pair) => pair.status === 'Активна' || pair.status === 'Требует внимания')
  return (
    <>
      <PageTitle title={`Добрый день, ${CURATOR.firstName}!`} subtitle={`Сводка по платформе на ${today}`} />

      <ul className={styles.stats}>
        {STATS.map((stat) => (
          <li key={stat.label} className={styles.stat}>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statValue}>{stat.value || waiting}</p>
            <p className={`${styles.statNote} ${TONES[stat.tone]}`}>{stat.note}</p>
          </li>
        ))}
      </ul>

      <div className={styles.panels}>
        <section className={styles.panel} aria-labelledby="pairs-title">
          <div className={styles.panelHead}>
            <h2 id="pairs-title" className={styles.panelTitle}>
              Активные пары
            </h2>
            <Link to="/admin/pairs" className={styles.more}>
              Все пары →
            </Link>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Пара</th>
                  <th>Совместимость</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {pairs.map((pair) => (
                  <tr key={pair.id}>
                    <td>
                      <div className={styles.pair}>
                        <span className={styles.avatars}>
                          <Avatar {...pair.mentor} />
                          <Avatar {...pair.mentee} />
                        </span>
                        <div>
                          <p className={styles.pairName}>{pair.names}</p>
                          <p className={styles.pairGoal}>{pair.goal}</p>
                        </div>
                      </div>
                    </td>
                    <td>{pair.compatibility}%</td>
                    <td>
                      <Pill>{pair.status}</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/admin/pairs" className={styles.button}>
            Активные пары
          </Link>
        </section>

        <section className={styles.panel} aria-labelledby="complaints-title">
          <div className={styles.panelHead}>
            <h2 id="complaints-title" className={styles.panelTitle}>
              Жалобы (последние)
            </h2>
            <Link to="/admin/complaints" className={styles.more}>
              Все жалобы →
            </Link>
          </div>
          <ul className={styles.complaints}>
            {complaints.slice(0, 3).map((complaint) => {
              const user = users.find((item) => item.id === complaint.userId)
              if (!user) return null
              return (
                <li key={complaint.id} className={styles.complaint}>
                  <div className={styles.complaintHead}>
                    <Avatar initials={initials(user.name)} color={user.color} />
                    <div className={styles.complaintAuthor}>
                      <p className={styles.pairName}>{user.name}</p>
                      <p className={styles.pairGoal}>{user.role}</p>
                    </div>
                    <Pill>{complaint.status}</Pill>
                  </div>
                  <p className={styles.complaintText}>
                    {complaint.reason} · {complaint.date}
                  </p>
                </li>
              )
            })}
          </ul>
          <Link to="/admin/complaints" className={styles.button}>
            Жалобы
          </Link>
        </section>
      </div>
    </>
  )
}
