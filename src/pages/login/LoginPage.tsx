import { useCallback, useId } from 'react'
import { useNavigate } from 'react-router'
import { LandingPage } from '@/pages/landing/LandingPage'
import { Modal } from '@/shared/ui/Modal/Modal'
import { LoginForm } from './LoginForm'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const navigate = useNavigate()
  const titleId = useId()

  const close = useCallback(() => navigate('/'), [navigate])

  // Пока нет API: сразу открываем главную для вошедшего пользователя
  const submit = () => navigate('/home')

  return (
    <>
      <LandingPage />
      <Modal labelledBy={titleId} onClose={close} className={styles.dialog}>
        <LoginForm titleId={titleId} onSubmit={submit} />
      </Modal>
    </>
  )
}
