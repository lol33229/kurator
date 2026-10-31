import { useEffect, type ReactNode } from 'react'
import closeIcon from '@/assets/icons/xmark.svg'
import styles from './Modal.module.css'

type ModalProps = {
  labelledBy: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ labelledBy, onClose, children }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = overflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Закрыть">
          <img src={closeIcon} alt="" width={40} height={40} />
        </button>
        {children}
      </div>
    </div>
  )
}
