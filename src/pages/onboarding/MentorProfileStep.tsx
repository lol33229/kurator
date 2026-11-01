import { useState, type FormEvent } from 'react'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { MultiSelect } from '@/shared/ui/MultiSelect/MultiSelect'
import { DIRECTION_OPTIONS, EXPERIENCE_OPTIONS, POSITION_OPTIONS, SKILL_LEVEL_OPTIONS, SKILL_OPTIONS } from './options'
import styles from './Onboarding.module.css'

export type MentorProfile = {
  position: string
  experience: string
  skills: string[]
  // Уровень для каждого выбранного навыка
  levels: Record<string, string>
  directions: string[]
}

type MentorProfileErrors = {
  position?: string
  experience?: string
  skills?: string
  levels?: Record<string, string>
  directions?: string
}

function validate({ position, experience, skills, levels, directions }: MentorProfile): MentorProfileErrors {
  const errors: MentorProfileErrors = {}
  if (!position) errors.position = 'Выберите роль'
  if (!experience) errors.experience = 'Выберите стаж'
  if (skills.length === 0) errors.skills = 'Выберите хотя бы один навык'
  const missing = skills.filter((skill) => !levels[skill])
  if (missing.length > 0) errors.levels = Object.fromEntries(missing.map((skill) => [skill, 'Выберите уровень']))
  if (directions.length === 0) errors.directions = 'Выберите хотя бы одно направление'
  return errors
}

type MentorProfileStepProps = {
  values: MentorProfile
  onChange: (values: MentorProfile) => void
  onBack: () => void
  onNext: () => void
}

export function MentorProfileStep({ values, onChange, onBack, onNext }: MentorProfileStepProps) {
  const [submitted, setSubmitted] = useState(false)
  const errors = submitted ? validate(values) : {}

  const set = <K extends keyof MentorProfile>(field: K, value: MentorProfile[K]) => onChange({ ...values, [field]: value })
  const skillLabel = (skill: string) => SKILL_OPTIONS.find((option) => option.value === skill)?.label ?? skill

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values)).length === 0) onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className={styles.stepLabel}>Шаг 3.</p>
      <p className={styles.sectionTitle}>Профессиональный профиль</p>
      <div className={styles.fields}>
        <Dropdown
          className={styles.field}
          label="Роль и должность"
          placeholder="Выберите роль"
          options={POSITION_OPTIONS}
          required
          value={values.position}
          onChange={(position) => set('position', position)}
          error={errors.position}
        />
        <Dropdown
          className={styles.field}
          label="Стаж работы"
          placeholder="Выберите стаж"
          options={EXPERIENCE_OPTIONS}
          required
          value={values.experience}
          onChange={(experience) => set('experience', experience)}
          error={errors.experience}
        />
        <div>
          <MultiSelect
            className={styles.field}
            label="Ваши навыки и компетенции"
            placeholder="Выберите навыки"
            options={SKILL_OPTIONS}
            required
            value={values.skills}
            onChange={(skills) => set('skills', skills)}
            error={errors.skills}
          />
          {values.skills.length > 0 && (
            <fieldset className={styles.levels}>
              <legend className={styles.levelsLegend}>
                Уровень владения навыком<span className={styles.required}> *</span>
              </legend>
              {values.skills.map((skill) => (
                <Dropdown
                  key={skill}
                  chip
                  className={styles.levelRow}
                  label={skillLabel(skill)}
                  placeholder="Выберите уровень"
                  options={SKILL_LEVEL_OPTIONS}
                  value={values.levels[skill] ?? ''}
                  onChange={(level) => set('levels', { ...values.levels, [skill]: level })}
                  error={errors.levels?.[skill]}
                />
              ))}
            </fieldset>
          )}
        </div>
        <MultiSelect
          className={styles.field}
          label="Направления наставничества"
          placeholder="Выберите направление"
          options={DIRECTION_OPTIONS}
          required
          value={values.directions}
          onChange={(directions) => set('directions', directions)}
          error={errors.directions}
        />
      </div>
      <div className={`${styles.footer} ${styles.mentorStep3Footer}`}>
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
