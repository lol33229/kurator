import { useNavigate, useSearchParams } from 'react-router'
import { LandingWithModal } from '@/pages/landing/LandingWithModal'
import { RegisterForm, type RegisterValues } from './RegisterForm'

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Пока нет API: переходим к шагу ввода кода из письма
  const submit = ({ email }: RegisterValues) => {
    navigate('/register/confirm', { state: { email, role: searchParams.get('role') ?? 'student' } })
  }

  return <LandingWithModal>{(titleId) => <RegisterForm titleId={titleId} onSubmit={submit} />}</LandingWithModal>
}
