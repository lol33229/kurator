import { useState, type FormEvent } from 'react'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { ROLE_OPTIONS } from './options'
import styles from './Onboarding.module.css'

type RoleStepProps = {
  role: string
  onChange: (role: string) => void
  onNext: () => void
}

export function RoleStep({ role, onChange, onNext }: RoleStepProps) {
  const [submitted, setSubmitted] = useState(false)
  const error = submitted && !role ? 'Выберите роль' : undefined

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (role) onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className={styles.stepLabel}>Шаг 1.</p>
      <Dropdown
        className={`${styles.field} ${styles.roleField}`}
        label="Выбор роли"
        placeholder="Выберите роль"
        options={ROLE_OPTIONS}
        value={role}
        onChange={onChange}
        error={error}
      />
      <div className={`${styles.footer} ${styles.step1Footer}`}>
        <button type="submit" className={styles.next}>
          Далее
        </button>
      </div>
    </form>
  )
}
