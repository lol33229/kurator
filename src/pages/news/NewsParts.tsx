import { Link } from 'react-router'
import calendarIcon from '@/assets/news/calendar.svg'
import chartIcon from '@/assets/news/chart.svg'
import dateIcon from '@/assets/news/date.svg'
import robotIcon from '@/assets/news/robot.svg'
import type { NewsCoverIcon, NewsItem } from './newsData'
import styles from './News.module.css'

const ICONS: Record<NewsCoverIcon, string> = { robot: robotIcon, calendar: calendarIcon, chart: chartIcon }

// Обложка: градиент, два светлых круга и иконка по центру
export function NewsCover({ item, size, className }: { item: NewsItem; size: 'lg' | 'sm'; className?: string }) {
  if (!item.cover) return null
  const iconSize = size === 'lg' ? 170 : 110
  return (
    <div className={[styles.cover, styles[item.cover.theme], className].filter(Boolean).join(' ')} aria-hidden="true">
      <span className={styles.circleBig} />
      <span className={styles.circleSmall} />
      <img className={styles.coverIcon} src={ICONS[item.cover.icon]} alt="" width={iconSize} height={iconSize} />
    </div>
  )
}

export function NewsDate({ date, className }: { date: string; className?: string }) {
  return (
    <p className={[styles.date, className].filter(Boolean).join(' ')}>
      <img src={dateIcon} alt="" width={14} height={14} />
      {date}
    </p>
  )
}

export function ReadLink({ id, title }: { id: string; title: string }) {
  return (
    <Link to={`/news/${id}`} className={styles.read} aria-label={`Читать: ${title}`}>
      Читать
    </Link>
  )
}
