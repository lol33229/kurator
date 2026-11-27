// ИИ-подбор наставников через ML-сервис

import { ML_URL } from './ml'

// Значения полей — как в анкетах (src/pages/onboarding/options.ts)
export type StudentProfile = {
  id: string
  first_name: string
  city: string
  language: string
  skills: string[]
  level: string
  tasks: string[]
  format: string
  availability: string
  budget_from?: number
  budget_to?: number
  goal: string
  deadline: string
}

export type MentorProfile = {
  id: string
  first_name: string
  city: string
  language: string
  position: string
  experience: string
  // Навык и уровень владения
  skills: Record<string, string>
  directions: string[]
  format: string
  availability: string
  price_model: string
  price: number
  free_trial?: boolean
  duration?: string
  about?: string
  rating?: number
  reviews_count?: number
}

export type Recommendation = {
  mentor_id: string
  // Совместимость, %
  score: number
  matched_skills: string[]
  matched_goals: string[]
  // Пункты «Почему подходит?»
  reasons: string[]
}

// Бросает ошибку, если сервис не запущен или не ответил вовремя
export async function getRecommendations(student: StudentProfile, mentors: MentorProfile[]): Promise<Recommendation[]> {
  const response = await fetch(`${ML_URL}/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // Порог 0: процент нужен для всех, отсеивают фильтры на странице
    body: JSON.stringify({ student, mentors, min_score: 0, limit: 100 }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!response.ok) throw new Error(`ML-сервис ответил ${response.status}`)
  const data: { recommendations: Recommendation[] } = await response.json()
  return data.recommendations
}
