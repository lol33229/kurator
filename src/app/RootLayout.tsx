import { Outlet, useLocation } from 'react-router'
import { MENTOR } from '@/pages/mentor/data'
import { STUDENT } from '@/pages/student/data'
import { ChatbotButton } from '@/shared/ui/ChatbotButton/ChatbotButton'

// Общая обёртка всех страниц
export function RootLayout() {
  const { pathname } = useLocation()
  // Пока нет авторизации, роль понимаем по разделу
  const isMentor = pathname.startsWith('/mentor/') || pathname === '/mentor'
  // В панели куратора свой раздел «ИИ-бот», плавающая кнопка не нужна
  const isAdmin = pathname.startsWith('/admin')
  return (
    <>
      <Outlet />
      {!isAdmin && (
        <ChatbotButton
          key={isMentor ? 'mentor' : 'mentee'}
          role={isMentor ? 'mentor' : 'mentee'}
          userName={isMentor ? MENTOR.firstName : STUDENT.firstName}
        />
      )}
    </>
  )
}
