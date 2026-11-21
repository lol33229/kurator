import { Outlet, useLocation } from 'react-router'
import { MENTOR } from '@/pages/mentor/data'
import { STUDENT } from '@/pages/student/data'
import { ChatbotButton } from '@/shared/ui/ChatbotButton/ChatbotButton'

// Общая обёртка всех страниц
export function RootLayout() {
  const { pathname } = useLocation()
  // Пока нет авторизации, роль понимаем по разделу
  const isMentor = pathname.startsWith('/mentor/') || pathname === '/mentor'
  return (
    <>
      <Outlet />
      <ChatbotButton
        key={isMentor ? 'mentor' : 'mentee'}
        role={isMentor ? 'mentor' : 'mentee'}
        userName={isMentor ? MENTOR.firstName : STUDENT.firstName}
      />
    </>
  )
}
