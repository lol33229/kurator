import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/home/HomePage'
import { LandingPage } from '@/pages/landing/LandingPage'
import { ROLES, ROLE_LABELS } from '@/shared/config/roles'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  // Главная для вошедшего пользователя; когда появится авторизация, будет открываться по «/».
  { path: '/home', element: <HomePage /> },
  { path: '/chatbot', element: <PagePlaceholder title="ИИ чат-бот" /> },
  { path: '/login', element: <PagePlaceholder title="Вход" /> },
  { path: '/register', element: <PagePlaceholder title="Регистрация" /> },
  { path: '/mentors', element: <PagePlaceholder title="Менторы" /> },
  { path: '/news', element: <PagePlaceholder title="Новости" /> },
  ...ROLES.map((role) => ({
    path: `/${role}`,
    element: <PagePlaceholder title={`Кабинет: ${ROLE_LABELS[role]}`} />,
  })),
  { path: '*', element: <PagePlaceholder title="Страница не найдена" /> },
])
