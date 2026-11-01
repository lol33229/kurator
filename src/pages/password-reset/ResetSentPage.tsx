import { LandingWithModal } from '@/pages/landing/LandingWithModal'
import styles from './PasswordReset.module.css'

export function ResetSentPage() {
  return (
    <LandingWithModal className={styles.sentDialog}>
      {(titleId) => (
        <p id={titleId} className={styles.message} role="status">
          Вам было направлено письмо на электронную почту для восстановления пароля
        </p>
      )}
    </LandingWithModal>
  )
}
