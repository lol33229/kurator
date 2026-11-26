import { createBrowserRouter } from 'react-router'
import { RootLayout } from '@/app/RootLayout'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { ComplaintPage } from '@/pages/admin/complaints/ComplaintPage'
import { ComplaintsPage } from '@/pages/admin/complaints/ComplaintsPage'
import { DashboardPage } from '@/pages/admin/dashboard/DashboardPage'
import { KnowledgeItemPage } from '@/pages/admin/knowledge/KnowledgeItemPage'
import { KnowledgePage } from '@/pages/admin/knowledge/KnowledgePage'
import { AdminNewsPage } from '@/pages/admin/news/AdminNewsPage'
import { PairPage } from '@/pages/admin/pairs/PairPage'
import { PairsPage } from '@/pages/admin/pairs/PairsPage'
import { NewsEditorPage } from '@/pages/admin/news/NewsEditorPage'
import { UserProfilePage } from '@/pages/admin/users/UserProfilePage'
import { UsersPage } from '@/pages/admin/users/UsersPage'
import { LandingPage } from '@/pages/landing/LandingPage'
import { LoginPage } from '@/pages/login/LoginPage'
import { MentorSearchPage } from '@/pages/mentors/MentorSearchPage'
import { MenteePage } from '@/pages/mentor/mentee/MenteePage'
import { MenteeRequestPage } from '@/pages/mentor/mentee/MenteeRequestPage'
import { MentorHomePage } from '@/pages/mentor/MentorHomePage'
import { MentorProfilePage } from '@/pages/mentor/profile/MentorProfilePage'
import { MessagesPage } from '@/pages/messages/MessagesPage'
import { NewsArticlePage } from '@/pages/news/NewsArticlePage'
import { NewsPage } from '@/pages/news/NewsPage'
import { NotificationsPage } from '@/pages/notifications/NotificationsPage'
import { OnboardingPage } from '@/pages/onboarding/OnboardingPage'
import { NewPasswordPage } from '@/pages/password-reset/NewPasswordPage'
import { ResetRequestPage } from '@/pages/password-reset/ResetRequestPage'
import { ResetSentPage } from '@/pages/password-reset/ResetSentPage'
import { ConfirmEmailPage } from '@/pages/register/ConfirmEmailPage'
import { RegisterPage } from '@/pages/register/RegisterPage'
import { SettingsPage } from '@/pages/settings/SettingsPage'
import { StudentProfilePage } from '@/pages/student/profile/StudentProfilePage'
import { StudentHomePage } from '@/pages/student/StudentHomePage'
import { ROLE_LABELS } from '@/shared/config/roles'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/password-reset', element: <ResetRequestPage /> },
      { path: '/password-reset/sent', element: <ResetSentPage /> },
      { path: '/password-reset/new', element: <NewPasswordPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/register/confirm', element: <ConfirmEmailPage /> },
      { path: '/onboarding', element: <OnboardingPage /> },
      { path: '/mentors', element: <MentorSearchPage /> },
      { path: '/news', element: <NewsPage /> },
      { path: '/news/:id', element: <NewsArticlePage /> },
      { path: '/messages', element: <MessagesPage /> },
      { path: '/notifications', element: <NotificationsPage /> },
      { path: '/settings', element: <SettingsPage /> },
      { path: '/student', element: <StudentHomePage /> },
      { path: '/student/requests', element: <PagePlaceholder title="Мои заявки" /> },
      { path: '/student/events', element: <PagePlaceholder title="События" /> },
      { path: '/student/goals', element: <PagePlaceholder title="Мои цели" /> },
      { path: '/student/profile', element: <StudentProfilePage /> },
      { path: '/student/history', element: <PagePlaceholder title="История наставничества" /> },
      { path: '/student/reviews', element: <PagePlaceholder title="Отзывы" /> },
      { path: '/mentor', element: <MentorHomePage /> },
      { path: '/mentor/requests', element: <PagePlaceholder title="Запросы менти" /> },
      { path: '/mentor/requests/:id', element: <MenteeRequestPage /> },
      { path: '/mentor/events', element: <PagePlaceholder title="События" /> },
      { path: '/mentor/mentees', element: <PagePlaceholder title="Мои менти" /> },
      { path: '/mentor/mentees/:id', element: <MenteePage /> },
      { path: '/mentor/profile', element: <MentorProfilePage /> },
      { path: '/mentor/history', element: <PagePlaceholder title="История наставничества" /> },
      { path: '/mentor/reviews', element: <PagePlaceholder title="Отзывы" /> },
      { path: '/curator', element: <PagePlaceholder title={`Кабинет: ${ROLE_LABELS.curator}`} /> },
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'pairs', element: <PairsPage /> },
          { path: 'pairs/:id', element: <PairPage /> },
          { path: 'complaints', element: <ComplaintsPage /> },
          { path: 'complaints/:id', element: <ComplaintPage /> },
          { path: 'users/:id', element: <UserProfilePage /> },
          { path: 'knowledge', element: <KnowledgePage /> },
          { path: 'knowledge/:id', element: <KnowledgeItemPage /> },
          { path: 'news', element: <AdminNewsPage /> },
          { path: 'news/new', element: <NewsEditorPage /> },
          { path: 'news/:id/edit', element: <NewsEditorPage /> },
          { path: 'bot', element: <PagePlaceholder title="ИИ-бот" /> },
        ],
      },
      { path: '*', element: <PagePlaceholder title="Страница не найдена" /> },
    ],
  },
])
