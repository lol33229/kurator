import { useId, type ReactNode } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Initials, SendButton } from './MentorResultCard'
import {
  MAX_COMPARE,
  capitalize,
  formatDurations,
  formatExperience,
  formatPrice,
  formatReviews,
  type SearchMentor,
} from './data'
import styles from './CompareModal.module.css'

type Row = {
  label: string
  value: (mentor: SearchMentor) => ReactNode
  // Чем больше, тем лучше; для цены — наоборот
  score?: (mentor: SearchMentor) => number
  bold?: boolean
}

const ROWS: Row[] = [
  { label: 'Совместимость', value: (m) => `${m.compatibility}%`, score: (m) => m.compatibility, bold: true },
  { label: 'Компания', value: (m) => m.company },
  { label: 'Направление', value: (m) => m.direction },
  { label: 'Опыт', value: (m) => formatExperience(m.experience), score: (m) => m.experience },
  { label: 'Навыки', value: (m) => m.skills.join(', ') },
  { label: 'Формат', value: (m) => m.formats.map(capitalize).join(', ') },
  { label: 'Доступность', value: (m) => `${m.hoursPerWeek} ч/нед`, score: (m) => m.hoursPerWeek },
  { label: 'Продолжительность', value: formatDurations },
  { label: 'Стоимость', value: formatPrice, score: (m) => -(m.price ?? 0) },
  {
    label: 'Рейтинг',
    value: (m) => (
      <>
        ★ {m.rating} <span className={styles.muted}>({formatReviews(m.reviews)})</span>
      </>
    ),
    score: (m) => m.rating,
  },
  { label: 'Город', value: (m) => m.city },
  {
    label: 'Языки',
    value: (m) => (m.languages.length > 0 ? m.languages.join(', ') : <span className={styles.empty}>—</span>),
  },
]

type CompareModalProps = {
  mentors: SearchMentor[]
  sent: string[]
  onSend: (id: string) => void
  onRemove: (id: string) => void
  onClose: () => void
}

// Сравнение выбранных наставников
export function CompareModal({ mentors, sent, onSend, onRemove, onClose }: CompareModalProps) {
  const titleId = useId()
  const emptySlots = Math.max(0, MAX_COMPARE - mentors.length)

  // Лучшее значение подсвечиваем, только когда есть с кем сравнивать
  const isBest = (row: Row, mentor: SearchMentor) => {
    if (!row.score || mentors.length < 2) return false
    const best = Math.max(...mentors.map(row.score))
    return row.score(mentor) === best
  }

  return (
    <Modal labelledBy={titleId} onClose={onClose} className={styles.dialog}>
      <div className={styles.head}>
        <h2 id={titleId} className={styles.title}>
          Сравнение менторов
        </h2>
        <span className={styles.count}>
          {mentors.length}/{MAX_COMPARE}
        </span>
      </div>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <td className={styles.labelCell} />
              {mentors.map((mentor) => (
                <th key={mentor.id} scope="col" className={styles.mentorCell}>
                  <Initials mentor={mentor} size={64} className={styles.avatar} />
                  <span className={styles.name}>{mentor.name}</span>
                  <span className={styles.position}>{mentor.position}</span>
                </th>
              ))}
              {Array.from({ length: emptySlots }, (_, index) => (
                <td key={index} className={styles.slotCell}>
                  <span className={styles.slotTitle}>Пустой слот</span>
                  <button type="button" className={styles.slotLink} onClick={onClose}>
                    + Добавить из списка
                  </button>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row" className={styles.labelCell}>
                  {row.label}
                </th>
                {mentors.map((mentor) => (
                  <td
                    key={mentor.id}
                    className={[styles.cell, row.bold && styles.bold, isBest(row, mentor) && styles.best].filter(Boolean).join(' ')}
                  >
                    {row.value(mentor)}
                  </td>
                ))}
                {Array.from({ length: emptySlots }, (_, index) => (
                  <td key={index} className={styles.cell} />
                ))}
              </tr>
            ))}
            <tr className={styles.actionsRow}>
              <td className={styles.labelCell} />
              {mentors.map((mentor) => (
                <td key={mentor.id} className={styles.actionsCell}>
                  <SendButton sent={sent.includes(mentor.id)} onSend={() => onSend(mentor.id)} className={styles.action} />
                  <button type="button" className={styles.remove} onClick={() => onRemove(mentor.id)}>
                    Убрать из сравнения
                  </button>
                </td>
              ))}
              {Array.from({ length: emptySlots }, (_, index) => (
                <td key={index} />
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  )
}
