import { useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

// Уведомление, переданное с другой страницы через state навигации
export function useRouteToast() {
  const navigate = useNavigate()
  const sent = (useLocation().state as { toast?: string } | null)?.toast
  const [toast, setToast] = useState<string | null>(sent ?? null)

  const hideToast = useCallback(() => {
    setToast(null)
    navigate('.', { replace: true, state: null })
  }, [navigate])

  return { toast, setToast, hideToast }
}
