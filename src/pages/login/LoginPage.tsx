import { useNavigate } from 'react-router'
import { LandingWithModal } from '@/pages/landing/LandingWithModal'
import { LoginForm } from './LoginForm'
import styles from './LoginPage.module.css'

export function LoginPage() {
  const navigate = useNavigate()

  // Пока нет API: сразу открываем главную для вошедшего пользователя
  const submit = () => navigate('/home')

  return (
    <LandingWithModal className={styles.dialog}>
      {(titleId) => <LoginForm titleId={titleId} onSubmit={submit} />}
    </LandingWithModal>
  )
}
