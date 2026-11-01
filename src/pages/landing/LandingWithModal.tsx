import { useCallback, useId, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Modal } from '@/shared/ui/Modal/Modal'
import { LandingPage } from './LandingPage'

type LandingWithModalProps = {
  className?: string
  children: (titleId: string) => ReactNode
}

// Окно поверх гостевого лендинга, при закрытии возвращает на главную
export function LandingWithModal({ className, children }: LandingWithModalProps) {
  const navigate = useNavigate()
  const titleId = useId()
  const close = useCallback(() => navigate('/'), [navigate])

  return (
    <>
      <LandingPage />
      <Modal labelledBy={titleId} onClose={close} className={className}>
        {children(titleId)}
      </Modal>
    </>
  )
}
