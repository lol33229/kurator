import type { ReactNode } from 'react'
import { Link } from 'react-router'
import chevronIcon from '@/assets/icons/chevron-wide.svg'
import styles from './DashboardCard.module.css'

type MoreLinkProps = {
  to: string
  label: string
}

// Стрелка «подробнее» в углу карточки
export function MoreLink({ to, label }: MoreLinkProps) {
  return (
    <Link to={to} className={styles.more} aria-label={label}>
      <img src={chevronIcon} alt="" width={23} height={24} />
    </Link>
  )
}

// Строка с заголовком карточки и стрелкой
export function CardHead({ children, more }: { children: ReactNode; more: MoreLinkProps }) {
  return (
    <div className={styles.cardHead}>
      {children}
      <MoreLink {...more} />
    </div>
  )
}
