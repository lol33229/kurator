import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { TextField } from '@/shared/ui/TextField/TextField'
import styles from './RegisterPage.module.css'

export type RegisterValues = {
  email: string
  password: string
  passwordRepeat: string
}

type RegisterFormProps = {
  titleId: string
  onSubmit: (values: RegisterValues) => void
}

export function RegisterForm({ titleId, onSubmit }: RegisterFormProps) {
  const [values, setValues] = useState<RegisterValues>({ email: '', password: '', passwordRepeat: '' })

  const change = (field: keyof RegisterValues) => (event: { target: { value: string } }) =>
    setValues((prev) => ({ ...prev, [field]: event.target.value }))

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit({ ...values, email: values.email.trim() })
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
