import { Outlet, useLocation } from 'react-router'
import { ChatbotButton } from '@/shared/ui/ChatbotButton/ChatbotButton'

// Общая обёртка всех страниц
export function RootLayout() {
  const { pathname } = useLocation()
  return (
    <>
      <Outlet />
      {pathname !== '/chatbot' && <ChatbotButton />}
    </>
  )
}
