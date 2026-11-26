import { useCallback } from 'react'
import { Outlet, useLocation } from 'react-router'
import { receiveHandoff } from '@/pages/admin/bot/botStore'
import { useKnowledge } from '@/pages/admin/knowledge/knowledgeStore'
import { MENTOR } from '@/pages/mentor/data'
import { STUDENT } from '@/pages/student/data'
import { ChatbotButton, type HandoffMessage } from '@/shared/ui/ChatbotButton/ChatbotButton'

// Пока нет авторизации: кто пишет боту с сайта
const SITE_USERS = {
  mentor: { id: 'site-mentor', name: MENTOR.shortName, role: 'Ментор', initials: 'АК', color: '#e09f3e' },
  mentee: { id: 'site-mentee', name: STUDENT.shortName, role: 'Менти', initials: 'АС', color: '#f4a261' },
} as const

// Общая обёртка всех страниц
export function RootLayout() {
  const { pathname } = useLocation()
  // Пока нет авторизации, роль понимаем по разделу
  const isMentor = pathname.startsWith('/mentor/') || pathname === '/mentor'
  // В панели куратора свой раздел «ИИ-бот», плавающая кнопка не нужна
  const isAdmin = pathname.startsWith('/admin')
  const role = isMentor ? 'mentor' : 'mentee'
  // Бот отвечает по базе знаний из админки
  const knowledge = useKnowledge()
  // Вопрос, на который бот не ответил, попадает во вкладку «ИИ-бот»
  const handoff = useCallback((messages: HandoffMessage[]) => receiveHandoff(SITE_USERS[role], messages), [role])
  return (
    <>
      <Outlet />
      {!isAdmin && (
        <ChatbotButton
          key={role}
          role={role}
          userName={isMentor ? MENTOR.firstName : STUDENT.firstName}
          knowledge={knowledge}
          onHandoff={handoff}
        />
      )}
    </>
  )
}
