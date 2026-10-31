import type { ComponentProps } from 'react'
import { Link } from 'react-router'
import styles from './Button.module.css'

type ButtonLinkProps = ComponentProps<typeof Link>

// Акцентная кнопка-ссылка
export function ButtonLink({ className, ...props }: ButtonLinkProps) {
  return <Link className={[styles.button, className].filter(Boolean).join(' ')} {...props} />
}
