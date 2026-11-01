import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { validateEmail, validatePasswordPair } from '@/shared/lib/validation'
import styles from '@/shared/ui/AuthForm/AuthForm.module.css'
import { TextField } from '@/shared/ui/TextField/TextField'

export type RegisterValues = {
  email: string
  password: string
  passwordRepeat: string
}

type RegisterErrors = Partial<Record<keyof RegisterValues, string>>

function validate({ email, password, passwordRepeat }: RegisterValues): RegisterErrors {
  const errors: RegisterErrors = validatePasswordPair(password, passwordRepeat, {
    emptyPassword: 'Придумайте пароль',
    emptyRepeat: 'Повторите пароль',
  })

  const emailError = validateEmail(email)
  if (emailError) errors.email = emailError

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
        <Link to="/login" className={styles.link}>
          Уже есть аккаунт?
        </Link>
      </form>
    </>
  )
}
