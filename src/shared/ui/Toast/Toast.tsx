import { useEffect } from 'react'
import styles from './Toast.module.css'

type ToastProps = {
  message: string
  onHide: () => void
  // Сколько миллисекунд показывать
  duration?: number
}

// Тёмная плашка с уведомлением вверху экрана
export function Toast({ message, onHide, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = window.setTimeout(onHide, duration)
    return () => window.clearTimeout(timer)
  }, [message, onHide, duration])

  return (
    <p className={styles.toast} role="status">
      {message}
    </p>
  )
}
