import { useState, type FormEvent } from 'react'
import { Dropdown } from '@/shared/ui/Dropdown/Dropdown'
import { TextArea } from '@/shared/ui/TextField/TextArea'
import { DEADLINE_OPTIONS } from './options'
import styles from './Onboarding.module.css'

export type Goal = {
  goal: string
  deadline: string
}

type GoalErrors = Partial<Record<keyof Goal, string>>

const MAX_GOAL_LENGTH = 1000
const MIN_GOAL_WORDS = 3

function validate({ goal, deadline }: Goal): GoalErrors {
  const errors: GoalErrors = {}
  const words = goal.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) errors.goal = 'Опишите вашу цель'
  else if (words.length < MIN_GOAL_WORDS) errors.goal = 'Пожалуйста, напишите более подробно - буквально еще пару слов'
  if (!deadline) errors.deadline = 'Выберите срок'
  return errors
}

type GoalStepProps = {
  values: Goal
  onChange: (values: Goal) => void
  onBack: () => void
  onNext: () => void
}

export function GoalStep({ values, onChange, onBack, onNext }: GoalStepProps) {
  const [submitted, setSubmitted] = useState(false)
  const errors = submitted ? validate(values) : {}

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (Object.keys(validate(values)).length === 0) onNext()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className={styles.stepLabel}>Шаг 4.</p>
      <p className={styles.sectionTitle}>Цель поиска</p>
      <div className={`${styles.fields} ${styles.goalFields}`}>
        <TextArea
          className={styles.field}
          label="Какая ваша основная цель?"
          placeholder="Опишите вашу цель"
          required
          autoFocus
          maxLength={MAX_GOAL_LENGTH}
          value={values.goal}
          onChange={(event) => onChange({ ...values, goal: event.target.value })}
          error={errors.goal}
        />
        <Dropdown
          className={styles.field}
          label="Срок достижения цели"
          placeholder="Выберите срок"
          options={DEADLINE_OPTIONS}
          required
          value={values.deadline}
          onChange={(deadline) => onChange({ ...values, deadline })}
          error={errors.deadline}
        />
      </div>
      <div className={`${styles.footer} ${styles.step4Footer}`}>
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
