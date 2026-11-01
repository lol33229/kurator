import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { validateEmail } from '@/shared/lib/validation'
import formStyles from '@/shared/ui/AuthForm/AuthForm.module.css'
import { TextField } from '@/shared/ui/TextField/TextField'
import styles from './LoginPage.module.css'

export type LoginValues = {
  email: string
  password: string
}

type LoginErrors = Partial<Record<keyof LoginValues, string>>

function validate({ email, password }: LoginValues): LoginErrors {
  const errors: LoginErrors = {}

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

  if (!password) errors.password = 'Введите пароль'

  return errors
}

type LoginFormProps = {
  titleId: string
  onSubmit: (values: LoginValues) => void
}

export function LoginForm({ titleId, onSubmit }: LoginFormProps) {
  const [values, setValues] = useState<LoginValues>({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)

  // Ошибки показываем после первой попытки отправки
  const errors = submitted ? validate(values) : {}

  const change = (field: keyof LoginValues) => (event: { target: { value: string } }) =>
    setValues((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values)).length === 0) onSubmit({ ...values, email: values.email.trim() })
  }

  return (
    <>
      <h2 id={titleId} className={formStyles.title}>
        Вход
      </h2>
      <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
        <TextField
          className={formStyles.field}
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
          className={formStyles.field}
          label="Пароль"
          type="password"
          autoComplete="current-password"
          placeholder="Введите пароль"
          required
          value={values.password}
          onChange={change('password')}
          error={errors.password}
        />
        <Link to="/password-reset" className={styles.forgot}>
          Забыли пароль?
        </Link>
        <button type="submit" className={formStyles.submit}>
          Войти
        </button>
        <Link to="/register" className={`${formStyles.link} ${styles.registerLink}`}>
          Еще нет аккаунта? Зарегистрируйся!
        </Link>
      </form>
    </>
  )
}
