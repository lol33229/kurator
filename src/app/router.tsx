import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/home/HomePage'
import { LandingPage } from '@/pages/landing/LandingPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { NewPasswordPage } from '@/pages/password-reset/NewPasswordPage'
import { ResetRequestPage } from '@/pages/password-reset/ResetRequestPage'
import { ResetSentPage } from '@/pages/password-reset/ResetSentPage'
import { ConfirmEmailPage } from '@/pages/register/ConfirmEmailPage'
import { RegisterPage } from '@/pages/register/RegisterPage'
import { ROLES, ROLE_LABELS } from '@/shared/config/roles'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  // Главная для вошедшего пользователя (временный адрес)
  { path: '/home', element: <HomePage /> },
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
  ...ROLES.map((role) => ({
    path: `/${role}`,
    element: <PagePlaceholder title={`Кабинет: ${ROLE_LABELS[role]}`} />,
  })),
  { path: '*', element: <PagePlaceholder title="Страница не найдена" /> },
])
