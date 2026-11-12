import { useState } from 'react'
import monthIcon from '@/assets/icons/chevron-down-small.svg'
import prevIcon from '@/assets/icons/chevron-left.svg'
import nextIcon from '@/assets/icons/chevron-right.svg'
import styles from './Calendar.module.css'

const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]
const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

// Дата в виде ключа 2026-04-15
const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

// Все дни сетки: с понедельника до воскресенья, включая хвосты соседних месяцев
function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - ((first.getDay() + 6) % 7))
  const last = new Date(year, month + 1, 0)
  const end = new Date(year, month + 1, (7 - last.getDay()) % 7)
  const days: Date[] = []
  for (const day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) days.push(new Date(day))
  return days
}

type CalendarProps = {
  initialMonth: Date
  // Дни со встречами, отмечаются точкой
  markedDates?: Set<string>
  // Низкая шапка, чтобы календарь занимал меньше места
  compact?: boolean
  className?: string
}

export function Calendar({ initialMonth, markedDates, compact, className }: CalendarProps) {
  const [view, setView] = useState({ year: initialMonth.getFullYear(), month: initialMonth.getMonth() })
  const shift = (delta: number) =>
    setView((current) => {
      const date = new Date(current.year, current.month + delta, 1)
      return { year: date.getFullYear(), month: date.getMonth() }
    })
  const days = monthGrid(view.year, view.month)
  const weeks = Array.from({ length: days.length / 7 }, (_, index) => days.slice(index * 7, index * 7 + 7))
  const title = `${MONTHS[view.month]} ${view.year}`

  return (
    <div className={[styles.calendar, compact && styles.compact, className].filter(Boolean).join(' ')}>
      <div className={styles.header}>
        <span className={styles.title} aria-live="polite">
          {title}
          <img src={monthIcon} alt="" width={16} height={16} />
        </span>
        <button type="button" className={styles.nav} aria-label="Предыдущий месяц" onClick={() => shift(-1)}>
          <img src={prevIcon} alt="" width={16} height={16} />
        </button>
        <button type="button" className={styles.nav} aria-label="Следующий месяц" onClick={() => shift(1)}>
          <img src={nextIcon} alt="" width={16} height={16} />
        </button>
      </div>
      <table className={styles.grid}>
        <caption className={styles.hidden}>{title}</caption>
        <thead>
          <tr>
            {WEEKDAYS.map((weekday, index) => (
              <th key={weekday} scope="col" className={index >= 5 ? styles.weekend : undefined}>
                {weekday}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={toDateKey(week[0])}>
              {week.map((day, index) => {
                const key = toDateKey(day)
                const marked = markedDates?.has(key)
                return (
                  <td
                    key={key}
                    className={[
                      styles.day,
                      day.getMonth() !== view.month && styles.outside,
                      index >= 5 && styles.weekend,
                      marked && styles.marked,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-label={marked ? `${day.getDate()}, есть встреча` : undefined}
                  >
                    {day.getDate()}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
