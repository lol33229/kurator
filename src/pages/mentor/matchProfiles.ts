// Анкеты для ИИ-подбора на стороне ментора: сам ментор и его менти / заявки.
// Значения — как в анкетах онбординга (src/pages/onboarding/options.ts)

import { useEffect, useState } from 'react'
import { getRecommendations, type MentorProfile, type StudentProfile } from '@/shared/api/matching'

const ME: MentorProfile = {
  id: 'anton',
  first_name: 'Антон',
  city: 'Екатеринбург',
  language: 'ru',
  position: 'ML-инженер',
  experience: '5-10',
  skills: { Python: 'expert', 'Машинное обучение': 'expert', SQL: 'advanced', 'Аналитика данных': 'advanced' },
  directions: ['Освоение профессии', 'Подготовка к собеседованию', 'Карьерный рост'],
  format: 'mixed',
  availability: '3-5',
  price_model: 'hour',
  price: 2500,
  duration: '6m',
  about: 'Senior Data Scientist в Яндексе: рекомендательные системы, аналитическая платформа. Помогаю войти в Data Science.',
}

const student = (id: string, profile: Omit<StudentProfile, 'id' | 'city' | 'language'>): StudentProfile => ({
  id,
  city: 'Екатеринбург',
  language: 'ru',
  ...profile,
})

const MENTEES: StudentProfile[] = [
  student('aleksey', {
    first_name: 'Алексей',
    skills: ['Python', 'SQL', 'Аналитика данных', 'Машинное обучение'],
    level: 'beginner',
    tasks: ['Освоить новую профессию', 'Подготовиться к собеседованию'],
    format: 'online',
    availability: '3-5',
    budget_to: 3000,
    goal: 'Получить стажировку в Data Science',
    deadline: '6m',
  }),
  student('elena', {
    first_name: 'Елена',
    skills: ['Python', 'Аналитика данных'],
    level: 'beginner',
    tasks: ['Освоить новую профессию'],
    format: 'online',
    availability: '3-5',
    goal: 'Стать специалистом в Data Science',
    deadline: '6m',
  }),
  student('artur', {
    first_name: 'Артур',
    skills: ['SQL', 'Аналитика данных'],
    level: 'basic',
    tasks: ['Прокачать навыки', 'Построить карьерный план'],
    format: 'mixed',
    availability: '1-2',
    goal: 'Развиться в аналитике и перейти в Data Science',
    deadline: '6m',
  }),
  student('maria', {
    first_name: 'Мария',
    skills: ['Python', 'Машинное обучение'],
    level: 'beginner',
    tasks: ['Освоить новую профессию'],
    format: 'online',
    availability: '6-10',
    goal: 'Стать специалистом в Data Science',
    deadline: '3m',
  }),
  student('lev', {
    first_name: 'Лев',
    skills: ['Python', 'Машинное обучение', 'SQL'],
    level: 'advanced',
    tasks: ['Построить карьерный план', 'Получить обратную связь по работам'],
    format: 'online',
    availability: '1-2',
    goal: 'Подготовка к переходу в Senior Data Scientist',
    deadline: '6m',
  }),
]

// Совместимость ментора с каждым менти от ML-сервиса; пустая, пока сервис не ответил
export function useMenteeMatches() {
  const [scores, setScores] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    let alive = true
    Promise.all(
      MENTEES.map((mentee) =>
        getRecommendations(mentee, [ME]).then((list) => [mentee.id, list[0]?.score] as const),
      ),
    )
      .then((pairs) => {
        if (!alive) return
        setScores(new Map(pairs.filter((pair): pair is readonly [string, number] => pair[1] !== undefined)))
      })
      // Сервис недоступен — остаются примерные проценты из данных
      .catch(() => undefined)
    return () => {
      alive = false
    }
  }, [])

  return scores
}
