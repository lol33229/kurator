import type { ModerationReason } from '@/shared/api/moderation'
import { createStore } from '../createStore'

export type ReviewStatus = 'На проверке' | 'Опубликован' | 'Отклонён'

export const REVIEW_STATUSES: ReviewStatus[] = ['На проверке', 'Опубликован', 'Отклонён']

type Person = { id: string; name: string; role: 'Ментор' | 'Менти' }

// Отзыв участника пары; reasons — что нашла ИИ-модерация
export type PlatformReview = {
  id: string
  author: Person
  target: Person
  rating: number
  text: string
  date: string
  status: ReviewStatus
  reasons: ModerationReason[]
}

const REVIEWS: PlatformReview[] = [
  {
    id: 'seed-1',
    author: { id: 'timur', name: 'Тимур Ахметов', role: 'Менти' },
    target: { id: 'ivan', name: 'Иван Шестаков', role: 'Ментор' },
    rating: 5,
    text: 'Иван отлично объясняет MLOps. Если нужна помощь с проектом, пишите ему напрямую: ivan.sh@mail.ru',
    date: '25.11.2026',
    status: 'На проверке',
    reasons: ['personal_data'],
  },
  {
    id: 'seed-2',
    author: { id: 'irina', name: 'Ирина Белова', role: 'Менти' },
    target: { id: 'maria', name: 'Мария Иванова', role: 'Ментор' },
    rating: 5,
    text: 'Встречи постоянно переносятся, ответов на вопросы не дождаться. Не рекомендую.',
    date: '24.11.2026',
    status: 'На проверке',
    reasons: ['rating_mismatch'],
  },
  {
    id: 'seed-3',
    author: { id: 'anna', name: 'Анна Сапрыкина', role: 'Ментор' },
    target: { id: 'aleksey', name: 'Алексей Смирнов', role: 'Менти' },
    rating: 5,
    text: 'Алексей вовлечён, задания сдаёт вовремя, быстро разобрался с pandas.',
    date: '20.11.2026',
    status: 'Опубликован',
    reasons: [],
  },
]

// Сохраняется в браузере: сайт и админка видят одни и те же отзывы
const store = createStore(REVIEWS, 'kurator.reviews.v1')

export const useReviews = store.use

export const addReview = (review: Omit<PlatformReview, 'id' | 'date'>) =>
  store.set((list) => [{ ...review, id: crypto.randomUUID(), date: new Date().toLocaleDateString('ru-RU') }, ...list])

// Решение куратора по отзыву на проверке
export const setReviewStatus = (id: string, status: ReviewStatus) =>
  store.set((list) => list.map((review) => (review.id === id ? { ...review, status } : review)))
