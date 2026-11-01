import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { LandingWithModal } from '@/pages/landing/LandingWithModal'
import { validateEmail } from '@/shared/lib/validation'
import formStyles from '@/shared/ui/AuthForm/AuthForm.module.css'
import { TextField } from '@/shared/ui/TextField/TextField'
import styles from './PasswordReset.module.css'

export function ResetRequestPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const error = submitted ? validateEmail(email) : undefined

  // Пока нет API: сразу показываем сообщение об отправке письма
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (!validateEmail(email)) navigate('/password-reset/sent', { state: { email: email.trim() } })
  }

  return (
    <LandingWithModal className={styles.requestDialog}>
      {(titleId) => (
        <>
          <h2 id={titleId} className={formStyles.title}>
            Восстановление пароля
          </h2>
          <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
            <TextField
              className={formStyles.field}
              label="Введите Ваш Email"
              type="email"
              autoComplete="email"
              placeholder="example@gmail.com"
              required
              autoFocus
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              error={error}
            />
            <button type="submit" className={formStyles.submit}>
              Восстановить
            </button>
          </form>
        </>
      )}
    </LandingWithModal>
  )
}
