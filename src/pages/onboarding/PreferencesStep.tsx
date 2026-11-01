import { useState, type FormEvent } from 'react'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { MultiSelect } from '@/shared/ui/MultiSelect/MultiSelect'
import { AVAILABILITY_OPTIONS, FORMAT_OPTIONS, LEVEL_OPTIONS, SKILL_OPTIONS, TASK_OPTIONS } from './options'
import styles from './Onboarding.module.css'

export type Preferences = {
  skills: string[]
  level: string
  tasks: string[]
  format: string
  availability: string
  budgetFrom: string
  budgetTo: string
}

type PreferencesErrors = Partial<Record<keyof Preferences, string>>

function validate({ skills, level, tasks, format, availability, budgetFrom, budgetTo }: Preferences): PreferencesErrors {
  const errors: PreferencesErrors = {}
  if (skills.length === 0) errors.skills = 'Выберите хотя бы один навык'
  if (!level) errors.level = 'Выберите уровень'
  if (tasks.length === 0) errors.tasks = 'Выберите хотя бы одну задачу'
  if (!format) errors.format = 'Выберите формат'
  if (!availability) errors.availability = 'Выберите доступность'
  if (budgetFrom && budgetTo && Number(budgetFrom) > Number(budgetTo)) errors.budgetTo = 'Сумма «от» больше суммы «до»'
  return errors
}

type PreferencesStepProps = {
  values: Preferences
  onChange: (values: Preferences) => void
  onBack: () => void
  onNext: () => void
}

export function PreferencesStep({ values, onChange, onBack, onNext }: PreferencesStepProps) {
  const [submitted, setSubmitted] = useState(false)
  const errors = submitted ? validate(values) : {}

  const set = <K extends keyof Preferences>(field: K, value: Preferences[K]) => onChange({ ...values, [field]: value })
  const digits = (text: string) => text.replace(/\D/g, '')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values)).length === 0) onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className={styles.stepLabel}>Шаг 3.</p>
      <p className={styles.sectionTitle}>Взаимодействие с ментором</p>
      <div className={styles.fields}>
        <MultiSelect
          className={styles.field}
          label="Навыки и технологии, которыми должен обладать ментор"
          placeholder="Выберите навыки"
          options={SKILL_OPTIONS}
          required
          value={values.skills}
          onChange={(skills) => set('skills', skills)}
          error={errors.skills}
        />
        <Dropdown
          className={styles.field}
          label="Ваш текущий уровень знаний"
          placeholder="Выберите уровень"
          options={LEVEL_OPTIONS}
          required
          value={values.level}
          onChange={(level) => set('level', level)}
          error={errors.level}
        />
        <MultiSelect
          className={styles.field}
          label="Задачи, с которыми нужна помощь"
          placeholder="Выберите задачи"
          options={TASK_OPTIONS}
          required
          value={values.tasks}
          onChange={(tasks) => set('tasks', tasks)}
          error={errors.tasks}
        />
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
          placeholder="Выберите доступность ментора"
          options={AVAILABILITY_OPTIONS}
          required
          value={values.availability}
          onChange={(availability) => set('availability', availability)}
          error={errors.availability}
        />
        <fieldset className={styles.budget}>
          <legend className={styles.budgetLegend}>Бюджет</legend>
          <div className={styles.budgetRow}>
            <span>От</span>
            <input
              className={[styles.budgetInput, errors.budgetTo && styles.budgetInvalid].filter(Boolean).join(' ')}
              inputMode="numeric"
              placeholder="1000"
              aria-label="Бюджет от, рублей"
              value={values.budgetFrom}
              onChange={(event) => set('budgetFrom', digits(event.target.value))}
            />
            <span className={styles.budgetTo}>до</span>
            <input
              className={[styles.budgetInput, errors.budgetTo && styles.budgetInvalid].filter(Boolean).join(' ')}
              inputMode="numeric"
              placeholder="100000"
              aria-label="Бюджет до, рублей"
              value={values.budgetTo}
              onChange={(event) => set('budgetTo', digits(event.target.value))}
            />
          </div>
          {errors.budgetTo && <p className={styles.photoError}>{errors.budgetTo}</p>}
        </fieldset>
      </div>
      <div className={`${styles.footer} ${styles.step3Footer}`}>
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
