import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { TextField } from '@/shared/ui/TextField/TextField'
import styles from './RegisterPage.module.css'

export type RegisterValues = {
  email: string
  password: string
  passwordRepeat: string
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

const MIN_PASSWORD_LENGTH = 8
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate({ email, password, passwordRepeat }: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = {}

  if (!email.trim()) errors.email = 'Введите email'
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Некорректный email'

  if (!password) errors.password = 'Придумайте пароль'
  else if (password.length < MIN_PASSWORD_LENGTH) errors.password = `Минимум ${MIN_PASSWORD_LENGTH} символов`

  if (!passwordRepeat) errors.passwordRepeat = 'Повторите пароль'
  else if (passwordRepeat !== password) errors.passwordRepeat = 'Пароли не совпадают'

  return errors
}

type RegisterFormProps = {
  titleId: string
  onSubmit: (values: RegisterValues) => void
}

export function RegisterForm({ titleId, onSubmit }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterValues>({ email: '', password: '', passwordRepeat: '' })
  const [submitted, setSubmitted] = useState(false)

  // Ошибки показываем после первой попытки отправки
  const errors = submitted ? validate(values) : {}

  const change = (field: keyof RegisterValues) => (event: { target: { value: string } }) =>
    setValues((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values)).length === 0) onSubmit({ ...values, email: values.email.trim() })
  }

  return (
    <>
      <h2 id={titleId} className={styles.title}>
        Регистрация
      </h2>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          className={styles.field}
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="example@gmail.com"
          required
          autoFocus
          value={values.email}
          onChange={change('email')}
          error={errors.email}
        />
        <TextField
          className={styles.field}
          label="Пароль"
          type="password"
          autoComplete="new-password"
          placeholder="Придумайте пароль"
          required
          value={values.password}
          onChange={change('password')}
          error={errors.password}
        />
        <TextField
          className={styles.field}
          label="Повторите пароль"
          type="password"
          autoComplete="new-password"
          placeholder="Введите пароль"
          required
          value={values.passwordRepeat}
          onChange={change('passwordRepeat')}
          error={errors.passwordRepeat}
        />
        <button type="submit" className={styles.submit}>
          Выслать код на почту
        </button>
        <Link to="/login" className={styles.loginLink}>
          Уже есть аккаунт?
        </Link>
      </form>
    </>
  )
}
