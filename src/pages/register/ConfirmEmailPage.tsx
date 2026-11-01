import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { LandingWithModal } from '@/pages/landing/LandingWithModal'
import formStyles from '@/shared/ui/AuthForm/AuthForm.module.css'
import styles from './ConfirmEmail.module.css'

const CODE_LENGTH = 6
const RESEND_DELAY = 30
// Пока нет API: верным считается этот код
const DEMO_CODE = '123456'

function secondsLabel(seconds: number) {
  const lastTwo = seconds % 100
  const last = seconds % 10
  if (lastTwo >= 11 && lastTwo <= 14) return `${seconds} секунд`
  if (last === 1) return `${seconds} секунду`
  if (last >= 2 && last <= 4) return `${seconds} секунды`
  return `${seconds} секунд`
}

export function ConfirmEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const inputId = useId()
  const errorId = `${inputId}-error`
  const [code, setCode] = useState('')
  const [error, setError] = useState<string>()
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (secondsLeft === 0) return
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [secondsLeft])

  const resend = () => {
    setSecondsLeft(RESEND_DELAY)
    setError(undefined)
    setCode('')
    inputRef.current?.focus()
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (code.length < CODE_LENGTH) setError('Введите код из письма')
    else if (code !== DEMO_CODE) setError('Неверный код')
    else navigate('/onboarding', { state: { role: location.state?.role } })
  }

  return (
    <LandingWithModal className={[styles.dialog, error && styles.dialogWithError].filter(Boolean).join(' ')}>
      {(titleId) => (
        <>
          <h2 id={titleId} className={formStyles.title}>
            Регистрация
          </h2>
          <form className={formStyles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.codeField}>
              <label className={styles.label} htmlFor={inputId}>
                Код из письма
              </label>
              <input
                id={inputId}
                ref={inputRef}
                className={[styles.input, error && styles.inputInvalid].filter(Boolean).join(' ')}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={CODE_LENGTH}
                placeholder="******"
                autoFocus
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
              />
              {error && (
                <p id={errorId} className={styles.error}>
                  {error}
                </p>
              )}
            </div>
            {secondsLeft > 0 ? (
              <p className={styles.timer} aria-live="polite">
                Запросить код повторно можно через <strong>{secondsLabel(secondsLeft)}</strong>
              </p>
            ) : (
              <button type="button" className={styles.resend} onClick={resend}>
                Отправить код еще раз
              </button>
            )}
            <button type="submit" className={formStyles.submit}>
              Подтвердить
            </button>
          </form>
        </>
      )}
    </LandingWithModal>
  )
}
