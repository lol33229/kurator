import { useState, type FormEvent } from 'react'
import checkedIcon from '@/assets/icons/square-check.svg'
import uncheckedIcon from '@/assets/icons/square.svg'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { AVAILABILITY_OPTIONS, FORMAT_OPTIONS, PRICE_MODEL_OPTIONS } from './options'
import styles from './Onboarding.module.css'

export type MentorTerms = {
  format: string
  availability: string
  priceModel: string
  price: string
  freeTrial: boolean
}

type MentorTermsErrors = Partial<Record<keyof MentorTerms, string>>

function validate({ format, availability, priceModel, price }: MentorTerms): MentorTermsErrors {
  const errors: MentorTermsErrors = {}
  if (!format) errors.format = 'Выберите формат'
  if (!availability) errors.availability = 'Выберите доступность'
  if (!priceModel) errors.priceModel = 'Выберите модель'
  if (!Number(price)) errors.price = 'Укажите цену'
  return errors
}

type MentorTermsStepProps = {
  values: MentorTerms
  onChange: (values: MentorTerms) => void
  onBack: () => void
  onNext: () => void
}

export function MentorTermsStep({ values, onChange, onBack, onNext }: MentorTermsStepProps) {
  const [submitted, setSubmitted] = useState(false)
  const errors = submitted ? validate(values) : {}

  const set = <K extends keyof MentorTerms>(field: K, value: MentorTerms[K]) => onChange({ ...values, [field]: value })

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values)).length === 0) onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className={styles.stepLabel}>Шаг 4.</p>
      <p className={styles.sectionTitle}>Взаимодействие с менти</p>
      <div className={`${styles.fields} ${styles.termsFields}`}>
        <Dropdown
          className={styles.field}
          label="Формат взаимодействия"
          placeholder="Выберите формат"
          options={FORMAT_OPTIONS}
          required
          value={values.format}
          onChange={(format) => set('format', format)}
          error={errors.format}
        />
        <Dropdown
          className={styles.field}
          label="Доступность по количеству часов"
          placeholder="Выберите Вашу доступность"
          options={AVAILABILITY_OPTIONS}
          required
          value={values.availability}
          onChange={(availability) => set('availability', availability)}
          error={errors.availability}
        />
        <Dropdown
          className={styles.field}
          label="Модель стоимости"
          placeholder="Выберите модель"
          options={PRICE_MODEL_OPTIONS}
          required
          value={values.priceModel}
          onChange={(priceModel) => set('priceModel', priceModel)}
          error={errors.priceModel}
        />
        <label className={styles.price}>
          <span>
            Цена<span className={styles.required}> *</span>
          </span>
          <input
            className={[styles.budgetInput, styles.priceInput, errors.price && styles.budgetInvalid].filter(Boolean).join(' ')}
            inputMode="numeric"
            maxLength={7}
            placeholder="1000"
            aria-invalid={Boolean(errors.price)}
            value={values.price}
            onChange={(event) => set('price', event.target.value.replace(/\D/g, ''))}
          />
          {errors.price && <span className={styles.photoError}>{errors.price}</span>}
        </label>
        <label className={styles.checkbox}>
          <span>
            Возможность бесплатной пробной сессии<span className={styles.required}> *</span>
          </span>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={values.freeTrial}
            onChange={(event) => set('freeTrial', event.target.checked)}
          />
          <img className={styles.checkboxIcon} src={values.freeTrial ? checkedIcon : uncheckedIcon} alt="" width={25} height={25} />
        </label>
      </div>
      <div className={`${styles.footer} ${styles.termsFooter}`}>
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
