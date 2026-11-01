import { useCallback, useId, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { HomePage } from '@/pages/home/HomePage'
import formStyles from '@/shared/ui/AuthForm/AuthForm.module.css'
import { Modal } from '@/shared/ui/Modal/Modal'
import { BasicInfoStep, type BasicInfo } from './BasicInfoStep'
import { ProgressSteps } from './ProgressSteps'
import { RoleStep } from './RoleStep'
import styles from './Onboarding.module.css'

const TOTAL_STEPS = 4

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

  const close = useCallback(() => navigate('/home'), [navigate])

  return (
    <>
      <HomePage />
      <Modal
        labelledBy={titleId}
        onClose={close}
        className={[styles.dialog, step === 2 && styles.dialogStep2].filter(Boolean).join(' ')}
      >
        <h2 id={titleId} className={`${formStyles.title} ${styles.title}`}>
          Заполнение анкеты
        </h2>
        <ProgressSteps current={step} total={TOTAL_STEPS} />
        {step === 1 && <RoleStep role={role} onChange={setRole} onNext={() => setStep(2)} />}
        {/* Шаги 3 и 4 появятся по макетам, пока анкета завершается на шаге 2 */}
        {step === 2 && (
          <BasicInfoStep values={basicInfo} onChange={setBasicInfo} onBack={() => setStep(1)} onNext={close} />
        )}
      </Modal>
    </>
  )
}
