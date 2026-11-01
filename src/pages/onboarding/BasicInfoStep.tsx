import { useState, type FormEvent } from 'react'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { TextField } from '@/shared/ui/TextField/TextField'
import { CITY_OPTIONS, LANGUAGE_OPTIONS } from './options'
import { PhotoUpload } from './PhotoUpload'
import styles from './Onboarding.module.css'

export type BasicInfo = {
  firstName: string
  lastName: string
  age: string
  city: string
  language: string
  photo: File | null
}

type BasicInfoErrors = Partial<Record<keyof BasicInfo, string>>

const MIN_AGE = 14
const MAX_AGE = 100

function validate({ firstName, lastName, age, city, language }: BasicInfo): BasicInfoErrors {
  const errors: BasicInfoErrors = {}
  if (!firstName.trim()) errors.firstName = 'Введите имя'
  if (!lastName.trim()) errors.lastName = 'Введите фамилию'
  if (!age) errors.age = 'Введите возраст'
  else if (Number(age) < MIN_AGE || Number(age) > MAX_AGE) errors.age = `Возраст от ${MIN_AGE} до ${MAX_AGE}`
  if (!city.trim()) errors.city = 'Укажите город'
  if (!language) errors.language = 'Выберите язык'
  return errors
}

type BasicInfoStepProps = {
  values: BasicInfo
  onChange: (values: BasicInfo) => void
  onBack: () => void
  onNext: () => void
}

export function BasicInfoStep({ values, onChange, onBack, onNext }: BasicInfoStepProps) {
  const [submitted, setSubmitted] = useState(false)
  const errors = submitted ? validate(values) : {}

  const set = <K extends keyof BasicInfo>(field: K, value: BasicInfo[K]) => onChange({ ...values, [field]: value })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values)).length === 0) onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className={styles.stepLabel}>Шаг 2.</p>
      <p className={styles.sectionTitle}>Базовые данные</p>
      <div className={styles.fields}>
        <TextField
          compact
          className={styles.field}
          label="Введите свое имя"
          placeholder="Например: Иван"
          autoComplete="given-name"
          required
          autoFocus
          value={values.firstName}
          onChange={(event) => set('firstName', event.target.value)}
          error={errors.firstName}
        />
        <TextField
          compact
          className={styles.field}
          label="Введите свою фамилию"
          placeholder="Например: Иванов"
          autoComplete="family-name"
          required
          value={values.lastName}
          onChange={(event) => set('lastName', event.target.value)}
          error={errors.lastName}
        />
        <TextField
          compact
          className={styles.field}
          label="Введите Ваш возраст"
          placeholder="Например: 20"
          inputMode="numeric"
          maxLength={3}
          required
          value={values.age}
          onChange={(event) => set('age', event.target.value.replace(/\D/g, ''))}
          error={errors.age}
        />
        <Dropdown
          searchable
          className={styles.field}
          label="Из какого Вы города?"
          placeholder="Введите свой город"
          options={CITY_OPTIONS}
          required
          value={values.city}
          onChange={(city) => set('city', city)}
          error={errors.city}
        />
        <Dropdown
          className={styles.field}
          label="Язык общения"
          placeholder="Выберите язык"
          options={LANGUAGE_OPTIONS}
          required
          value={values.language}
          onChange={(language) => set('language', language)}
          error={errors.language}
        />
      </div>
      <PhotoUpload photo={values.photo} onChange={(photo) => set('photo', photo)} />
      <div className={`${styles.footer} ${styles.step2Footer}`}>
        <button type="button" className={styles.back} onClick={onBack}>
          Назад
        </button>
        <button type="submit" className={styles.next}>
          Далее
        </button>
      </div>
    </form>
  )
}
