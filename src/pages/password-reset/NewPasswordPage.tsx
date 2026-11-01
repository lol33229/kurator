import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { LandingWithModal } from '@/pages/landing/LandingWithModal'
import { validatePasswordPair } from '@/shared/lib/validation'
import formStyles from '@/shared/ui/AuthForm/AuthForm.module.css'
import { TextField } from '@/shared/ui/TextField/TextField'
import styles from './PasswordReset.module.css'

const MESSAGES = { emptyPassword: 'Введите новый пароль', emptyRepeat: 'Подтвердите пароль' }

// Открывается по ссылке из письма
export function NewPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [passwordRepeat, setPasswordRepeat] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const errors = submitted ? validatePasswordPair(password, passwordRepeat, MESSAGES) : {}

  // Пока нет API: после сохранения предлагаем войти с новым паролем
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validatePasswordPair(password, passwordRepeat, MESSAGES)).length === 0) navigate('/login')
  }

  return (
    <LandingWithModal className={styles.newPasswordDialog}>
      {(titleId) => (
        <>
          <h2 id={titleId} className={formStyles.title}>
            Изменение данных
          </h2>
          <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
            <TextField
              className={formStyles.field}
              label="Новый пароль"
              type="password"
              autoComplete="new-password"
              placeholder="Введите новый пароль"
              required
              autoFocus
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              error={errors.password}
            />
            <TextField
              className={formStyles.field}
              label="Подтвердите пароль"
              type="password"
              autoComplete="new-password"
              placeholder="Повторите пароль"
              required
              value={passwordRepeat}
              onChange={(event) => setPasswordRepeat(event.target.value)}
              error={errors.passwordRepeat}
            />
            <button type="submit" className={formStyles.submit}>
              Сохранить
            </button>
          </form>
        </>
      )}
    </LandingWithModal>
  )
}
