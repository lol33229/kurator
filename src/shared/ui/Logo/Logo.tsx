import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import logoImage from '@/assets/landing/logo.png'
import styles from './Logo.module.css'

type LogoProps = {
  size?: 'md' | 'lg'
  className?: string
}

const SIZES = {
  md: { image: 82, font: 24 },
  lg: { image: 89, font: 32 },
}

export function Logo({ size = 'md', className }: LogoProps) {
  const { image, font } = SIZES[size]
  const vars = { '--logo-size': `${image}px`, '--logo-font-size': `${font}px` } as CSSProperties

  return (
    <Link to="/" className={[styles.logo, className].filter(Boolean).join(' ')} style={vars} aria-label="Куратор — на главную">
      <img className={styles.image} src={logoImage} alt="" width={image} height={image} />
      <span className={styles.text}>КУРАТОР</span>
    </Link>
  )
}
