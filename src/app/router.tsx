import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/app/RootLayout'
import { LandingPage } from '@/pages/landing/LandingPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { MentorHomePage } from '@/pages/mentor/MentorHomePage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { NewPasswordPage } from '@/pages/password-reset/NewPasswordPage'
import { ResetRequestPage } from '@/pages/password-reset/ResetRequestPage'
import { ResetSentPage } from '@/pages/password-reset/ResetSentPage'
import { ConfirmEmailPage } from '@/pages/register/ConfirmEmailPage'
import { RegisterPage } from '@/pages/register/RegisterPage'
import { StudentProfilePage } from '@/pages/student/profile/StudentProfilePage'
import { StudentHomePage } from '@/pages/student/StudentHomePage'
import { ROLES, ROLE_LABELS } from '@/shared/config/roles'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/chatbot', element: <PagePlaceholder title="ИИ чат-бот" /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/password-reset', element: <ResetRequestPage /> },
      { path: '/password-reset/sent', element: <ResetSentPage /> },
      { path: '/password-reset/new', element: <NewPasswordPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/confirm', element: <ConfirmEmailPage /> },
      { path: '/onboarding', element: <OnboardingPage /> },
      { path: '/mentors', element: <PagePlaceholder title="Менторы" /> },
      { path: '/news', element: <PagePlaceholder title="Новости" /> },
      { path: '/messages', element: <PagePlaceholder title="Сообщения" /> },
      { path: '/notifications', element: <PagePlaceholder title="Уведомления" /> },
      { path: '/settings', element: <PagePlaceholder title="Настройки" /> },
      { path: '/student', element: <StudentHomePage /> },
      { path: '/student/requests', element: <PagePlaceholder title="Мои заявки" /> },
      { path: '/student/events', element: <PagePlaceholder title="События" /> },
      { path: '/student/goals', element: <PagePlaceholder title="Мои цели" /> },
      { path: '/student/profile', element: <StudentProfilePage /> },
      { path: '/student/profile/edit', element: <PagePlaceholder title="Редактирование профиля" /> },
      { path: '/student/history', element: <PagePlaceholder title="История наставничества" /> },
      { path: '/student/reviews', element: <PagePlaceholder title="Отзывы" /> },
      { path: '/mentor', element: <MentorHomePage /> },
      { path: '/mentor/requests', element: <PagePlaceholder title="Запросы менти" /> },
      { path: '/mentor/events', element: <PagePlaceholder title="События" /> },
      { path: '/mentor/mentees', element: <PagePlaceholder title="Мои менти" /> },
      { path: '/mentor/profile', element: <PagePlaceholder title="Профиль ментора" /> },
      // Кабинеты куратора и администратора пока заглушки
      ...ROLES.filter((role) => role === 'curator' || role === 'admin').map((role) => ({
        path: `/${role}`,
        element: <PagePlaceholder title={`Кабинет: ${ROLE_LABELS[role]}`} />,
      })),
      { path: '*', element: <PagePlaceholder title="Страница не найдена" /> },
    ],
  },
])
