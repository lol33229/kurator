import { useCallback, useId, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { HomePage } from '@/pages/home/HomePage'
import formStyles from '@/shared/ui/AuthForm/AuthForm.module.css'
import { Modal } from '@/shared/ui/Modal/Modal'
import { BasicInfoStep, type BasicInfo } from './BasicInfoStep'
import { GoalStep, type Goal } from './GoalStep'
import { PreferencesStep, type Preferences } from './PreferencesStep'
import { ProgressSteps } from './ProgressSteps'
import { RoleStep } from './RoleStep'
import styles from './Onboarding.module.css'

const TOTAL_STEPS = 4

const STEP_DIALOG_CLASS: Record<number, string | undefined> = {
  2: styles.dialogStep2,
  3: styles.dialogStep3,
  4: styles.dialogStep4,
}

export function OnboardingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const titleId = useId()
  const [step, setStep] = useState(1)
  // Роль может прийти из регистрации («Стать наставником»)
  const [role, setRole] = useState<string>(location.state?.role ?? '')
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({
    firstName: '',
    lastName: '',
    age: '',
    city: '',
    language: '',
    photo: null,
  })
  const [preferences, setPreferences] = useState<Preferences>({
    skills: [],
    level: '',
    tasks: [],
    format: '',
    availability: '',
    budgetFrom: '',
    budgetTo: '',
  })
  const [goal, setGoal] = useState<Goal>({ goal: '', deadline: '' })

  const close = useCallback(() => navigate('/home'), [navigate])

  return (
    <>
      <HomePage />
      <Modal
        labelledBy={titleId}
        onClose={close}
        className={[styles.dialog, STEP_DIALOG_CLASS[step]].filter(Boolean).join(' ')}
      >
        <h2 id={titleId} className={`${formStyles.title} ${styles.title}`}>
          Заполнение анкеты
        </h2>
        <ProgressSteps current={step} total={TOTAL_STEPS} />
        {step === 1 && <RoleStep role={role} onChange={setRole} onNext={() => setStep(2)} />}
        {/* Анкета ментора появится позже, пока она завершается на шаге 2 */}
        {step === 2 && (
          <BasicInfoStep
            values={basicInfo}
            onChange={setBasicInfo}
            onBack={() => setStep(1)}
            onNext={role === 'student' ? () => setStep(3) : close}
          />
        )}
        {step === 3 && (
          <PreferencesStep
            values={preferences}
            onChange={setPreferences}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
          />
        )}
        {/* Пока нет API: после последнего шага открываем главную */}
        {step === 4 && <GoalStep values={goal} onChange={setGoal} onBack={() => setStep(3)} onNext={close} />}
      </Modal>
    </>
  )
}
