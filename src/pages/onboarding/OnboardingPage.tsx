import { useCallback, useId, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { HomePage } from '@/pages/home/HomePage'
import formStyles from '@/shared/ui/AuthForm/AuthForm.module.css'
import { Modal } from '@/shared/ui/Modal/Modal'
import { ProgressSteps } from './ProgressSteps'
import { RoleStep } from './RoleStep'
import styles from './Onboarding.module.css'

const TOTAL_STEPS = 4

export function OnboardingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const titleId = useId()
  // Роль может прийти из регистрации («Стать наставником»)
  const [role, setRole] = useState<string>(location.state?.role ?? '')

  const close = useCallback(() => navigate('/home'), [navigate])

  return (
    <>
      <HomePage />
      <Modal labelledBy={titleId} onClose={close} className={styles.dialog}>
        <h2 id={titleId} className={`${formStyles.title} ${styles.title}`}>
          Заполнение анкеты
        </h2>
        <ProgressSteps current={1} total={TOTAL_STEPS} />
        <RoleStep role={role} onChange={setRole} onNext={close} />
      </Modal>
    </>
  )
}
