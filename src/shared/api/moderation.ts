// Модерация отзывов через ML-сервис

import { ML_URL } from './ml'

export type ModerationReason = 'toxicity' | 'spam' | 'personal_data' | 'rating_mismatch'

export type ModerationResult = {
  review_id: string
  // publish — опубликовать, manual_review — проверит куратор, reject — отклонить
  verdict: 'publish' | 'manual_review' | 'reject'
  reasons: ModerationReason[]
  confidence: number
}

// Понятные человеку причины
export const REASON_TEXT: Record<ModerationReason, string> = {
  toxicity: 'грубые или оскорбительные слова',
  spam: 'реклама или ссылки на сторонние сервисы',
  personal_data: 'контакты или личные данные',
  rating_mismatch: 'оценка не совпадает с текстом отзыва',
}

// Бросает ошибку, если сервис не запущен или не ответил вовремя
export async function moderateReview(reviewId: string, text: string, rating: number): Promise<ModerationResult> {
  const response = await fetch(`${ML_URL}/moderation/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ review_id: reviewId, text, rating }),
    signal: AbortSignal.timeout(25_000),
  })
  if (!response.ok) throw new Error(`ML-сервис ответил ${response.status}`)
  return response.json()
}
