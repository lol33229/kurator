import { useCallback, useId } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { LandingPage } from '@/pages/landing/LandingPage'
import { Modal } from '@/shared/ui/Modal/Modal'
import { RegisterForm, type RegisterValues } from './RegisterForm'

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const titleId = useId()

  const close = useCallback(() => navigate('/'), [navigate])

  // Пока нет API: переходим к шагу ввода кода из письма
  const submit = ({ email }: RegisterValues) => {
    navigate('/register/confirm', { state: { email, role: searchParams.get('role') ?? 'student' } })
  }

  return (
    <>
      <LandingPage />
      <Modal labelledBy={titleId} onClose={close}>
        <RegisterForm titleId={titleId} onSubmit={submit} />
      </Modal>
    </>
  )
}
