import { useId, useState, type FormEvent } from 'react'
import { TASK_OPTIONS } from '@/pages/onboarding/options'
import onboardingStyles from '@/pages/onboarding/Onboarding.module.css'
import formStyles from '@/shared/ui/AuthForm/AuthForm.module.css'
import { Modal } from '@/shared/ui/Modal/Modal'
import { MultiSelect } from '@/shared/ui/MultiSelect/MultiSelect'
import styles from './StudentProfilePage.module.css'

type GoalsModalProps = {
  tasks: string[]
  onSave: (tasks: string[]) => void
  onClose: () => void
}

// Изменение задач, выбранных в анкете: из них складываются цели
export function GoalsModal({ tasks, onSave, onClose }: GoalsModalProps) {
  const titleId = useId()
  const [selected, setSelected] = useState(tasks)
  const [submitted, setSubmitted] = useState(false)
  const error = submitted && selected.length === 0 ? 'Выберите хотя бы одну задачу' : undefined

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setSubmitted(true)
    if (selected.length > 0) onSave(selected)
  }

  return (
    <Modal labelledBy={titleId} onClose={onClose} className={`${onboardingStyles.dialog} ${styles.goalsDialog}`}>
      <h2 id={titleId} className={`${formStyles.title} ${onboardingStyles.title}`}>
        Мои цели
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        <p className={onboardingStyles.sectionTitle}>С чем нужна помощь наставника</p>
        <div className={onboardingStyles.fields}>
          <MultiSelect
            className={onboardingStyles.field}
            label="Задачи, с которыми нужна помощь"
            placeholder="Выберите задачи"
            options={TASK_OPTIONS}
            required
            value={selected}
            onChange={setSelected}
            error={error}
          />
        </div>
        <div className={`${onboardingStyles.footer} ${styles.goalsFooter}`}>
          <button type="button" className={onboardingStyles.back} onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className={onboardingStyles.next}>
            Сохранить
          </button>
        </div>
      </form>
    </Modal>
  )
}
