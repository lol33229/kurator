import type { CSSProperties } from 'react'
import styles from './MentorSearch.module.css'

// Цвет кольца зависит от совместимости
const COLORS = [
  { from: 80, light: '#bfe3cc', strong: '#32ba76' },
  { from: 70, light: '#f7d7a2', strong: '#ffbe5c' },
  { from: 0, light: '#efe6c1', strong: '#f2c94c' },
]

type CompatRingProps = {
  value: number
  className?: string
}

// Кольцо с процентом совместимости
export function CompatRing({ value, className }: CompatRingProps) {
  const color = COLORS.find((item) => value >= item.from) ?? COLORS[2]
  const vars = {
    '--ring-light': color.light,
    '--ring-strong': color.strong,
    '--ring-value': `${value}%`,
  } as CSSProperties

  return (
    <div className={[styles.ring, className].filter(Boolean).join(' ')} style={vars}>
      <span className={styles.ringValue}>{value}%</span>
      <span className={styles.ringLabel}>совместимость</span>
    </div>
  )
}
