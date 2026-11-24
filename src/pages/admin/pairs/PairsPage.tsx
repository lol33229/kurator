import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Avatar, Filters, PageTitle, Pill } from '../AdminParts'
import t from '../AdminTable.module.css'
import { PAIR_STATUSES, type Pair } from '../adminData'
import styles from './Pairs.module.css'
import { usePairs } from './pairsStore'

const FILTERS = ['Все', ...PAIR_STATUSES] as const
type Filter = (typeof FILTERS)[number]

// «1 новое», «2 новых»
const newAppeals = (pair: Pair) => {
  const count = pair.appeals.filter((appeal) => appeal.status === 'Новое').length
  return count === 0 ? null : `${count} ${count === 1 ? 'новое' : 'новых'}`
}

// Полоска совместимости с процентом
export function Meter({ value }: { value: number }) {
  return (
    <div className={styles.meter}>
      <span className={styles.track} aria-hidden="true">
        <span className={styles.fill} style={{ width: `${value}%` }} />
      </span>
      <span className={styles.meterValue}>{value}%</span>
    </div>
  )
}

// Все наставнические пары с фильтром по статусу
export function PairsPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<Filter>('Все')
  const visible = usePairs().filter((pair) => filter === 'Все' || pair.status === filter)

  return (
    <>
      <PageTitle title="Подбор наставнических пар" subtitle="Все пары, их статус и совместимость" />
      <Filters label="Статус пары" options={FILTERS} value={filter} onChange={setFilter} className={styles.filters} />

      <div className={`${t.card} ${styles.card}`}>
        <table className={`${t.table} ${styles.table}`}>
          <thead>
            <tr>
              <th>Пара</th>
              <th>Совместимость</th>
              <th>Прогресс цели</th>
              <th>Обращения</th>
              <th>Статус</th>
              <th>Старт</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((pair) => {
              const appeals = newAppeals(pair)
              return (
                <tr key={pair.id} className={styles.row} onClick={() => navigate(`/admin/pairs/${pair.id}`)}>
                  <td className={styles.pairCell}>
                    <div className={styles.pair}>
                      <span className={styles.avatars}>
                        <Avatar initials={pair.mentor.initials} color={pair.mentor.color} />
                        <span className={styles.arrow} aria-hidden="true">
                          {'↔︎'}
                        </span>
                        <Avatar initials={pair.mentee.initials} color={pair.mentee.color} />
                      </span>
                      <div className={styles.pairText}>
                        <Link to={`/admin/pairs/${pair.id}`} className={styles.pairName} onClick={(event) => event.stopPropagation()}>
                          {pair.names}
                        </Link>
                        <p className={t.sub}>{pair.goal}</p>
                      </div>
                    </div>
                  </td>
                  <td className={styles.compatCell}>{pair.compatibility === null ? <span className={styles.none}>—</span> : <Meter value={pair.compatibility} />}</td>
                  <td className={styles.progressCell}>
                    <span className={styles.mobileLabel}>Прогресс цели: </span>
                    {pair.progress}%
                  </td>
                  <td className={styles.appealsCell}>{appeals ? <Pill tone="warning">{appeals}</Pill> : <span className={styles.none}>—</span>}</td>
                  <td className={styles.statusCell}>
                    <Pill>{pair.status}</Pill>
                  </td>
                  <td className={styles.dateCell}>{pair.started}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {visible.length === 0 && <p className={t.empty}>Пар с таким статусом нет</p>}
      </div>
    </>
  )
}
