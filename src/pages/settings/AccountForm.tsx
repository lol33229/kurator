import { useId, useState, type FormEvent } from 'react'
import { MIN_PASSWORD_LENGTH, validateEmail, validatePasswordPair } from '@/shared/lib/validation'
import styles from './Settings.module.css'

export type Account = { email: string; passwordChanged: string }

type Errors = { email?: string; password?: string; passwordRepeat?: string; current?: string }

// Надёжность пароля: сколько из трёх полосок закрасить
function strength(password: string) {
  if (!password) return 0
  let score = password.length >= MIN_PASSWORD_LENGTH ? 1 : 0
  if (/\d/.test(password) && /[a-zа-яё]/i.test(password)) score += 1
  if (password.length >= 12 || /[^a-zа-яё0-9]/i.test(password)) score += 1
  return Math.max(score, 1)
}

const STRENGTH_LABELS = ['', 'слабый', 'средний', 'надёжный']

type PasswordInputProps = {
  id: string
  value: string
  placeholder: string
  error?: string
  autoComplete?: string
  onChange: (value: string) => void
}

// Поле пароля с кнопкой «показать»
function PasswordInput({ id, value, placeholder, error, autoComplete = 'new-password', onChange }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)
  return (
    <div className={styles.passwordField}>
      <input
        id={id}
        className={[styles.input, error && styles.inputError].filter(Boolean).join(' ')}
        type={visible ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        type="button"
        className={styles.eye}
        aria-label={visible ? 'Скрыть пароль' : 'Показать пароль'}
        aria-pressed={visible}
        onClick={() => setVisible(!visible)}
      >
        {'\u{1F441}\uFE0E'}
      </button>
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

type AccountFormProps = {
  account: Account
  onSave: (account: Account) => void
  onCancel: () => void
}

// Изменение почты и пароля
export function AccountForm({ account, onSave, onCancel }: AccountFormProps) {
  const id = useId()
  const [email, setEmail] = useState(account.email)
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [current, setCurrent] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const level = strength(password)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const next: Errors = { email: validateEmail(email) }
    // Пароль меняем, только если начали вводить новый
    if (password || repeat) {
      Object.assign(next, validatePasswordPair(password, repeat, { emptyPassword: 'Введите новый пароль', emptyRepeat: 'Повторите пароль' }))
    }
    if (!current) next.current = 'Введите текущий пароль'
    setErrors(next)
    if (Object.values(next).some(Boolean)) return

    const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).replace(' г.', '')
    onSave({ email: email.trim(), passwordChanged: password ? today : account.passwordChanged })
  }

  return (
    <form className={styles.form} onSubmit={submit} noValidate>
      <label className={styles.label} htmlFor={`${id}-email`}>
        Почта
      </label>
      <input
        id={`${id}-email`}
        className={[styles.input, errors.email && styles.inputError].filter(Boolean).join(' ')}
        type="email"
        autoComplete="email"
        value={email}
        aria-invalid={Boolean(errors.email)}
        aria-describedby={errors.email ? `${id}-email-error` : undefined}
        onChange={(event) => setEmail(event.target.value)}
      />
      {errors.email && (
        <p id={`${id}-email-error`} className={styles.error}>
          {errors.email}
        </p>
      )}

      <p className={styles.formSection}>
        Смена пароля <span className={styles.formSectionNote}>— оставьте пустым, если не меняете</span>
      </p>
      <div className={styles.passwordRow}>
        <div>
          <label className={styles.label} htmlFor={`${id}-new`}>
            Новый пароль
          </label>
          <PasswordInput
            id={`${id}-new`}
            value={password}
            placeholder={`Не менее ${MIN_PASSWORD_LENGTH} символов`}
            error={errors.password}
            onChange={setPassword}
          />
          <div className={styles.strength} aria-hidden="true" data-level={level}>
            <span />
            <span />
            <span />
          </div>
          {level > 0 && <span className={styles.hidden}>Надёжность пароля: {STRENGTH_LABELS[level]}</span>}
        </div>
        <div>
          <label className={styles.label} htmlFor={`${id}-repeat`}>
            Повторите пароль
          </label>
          <PasswordInput
            id={`${id}-repeat`}
            value={repeat}
            placeholder="Ещё раз новый пароль"
            error={errors.passwordRepeat}
            onChange={setRepeat}
          />
        </div>
      </div>

      <p className={`${styles.formSection} ${styles.confirmSection}`}>Подтверждение</p>
      <div className={styles.currentField}>
        <label className={styles.label} htmlFor={`${id}-current`}>
          Текущий пароль <span className={styles.required}>*</span>
        </label>
        <PasswordInput id={`${id}-current`} value={current} placeholder="Ваш текущий пароль"
          error={errors.current}
          autoComplete="current-password"
          onChange={setCurrent}
        />
      </div>

      <div className={styles.formFooter}>
        <button type="button" className={styles.cancel} onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className={styles.edit}>
          Сохранить
        </button>
      </div>
    </form>
  )
}
