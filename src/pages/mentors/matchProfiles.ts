// Анкеты для ИИ-подбора в терминах ML-сервиса (значения из src/pages/onboarding/options.ts).
// Пока анкета онбординга никуда не сохраняется и нет бэкенда, берём демо-анкету менти.

import type { MentorProfile, StudentProfile } from '@/shared/api/matching'
import { SEARCH_MENTORS, type SearchMentor } from './data'

export const DEMO_STUDENT: StudentProfile = {
  id: 'student-aleksey',
  first_name: 'Алексей',
  city: 'Москва',
  language: 'ru',
  skills: ['Python', 'SQL', 'Аналитика данных', 'Машинное обучение'],
  level: 'basic',
  tasks: ['Освоить новую профессию', 'Подготовиться к собеседованию'],
  format: 'online',
  availability: '3-5',
  goal: 'Получить стажировку в Data Science: подтянуть Python и машинное обучение, подготовиться к собеседованию',
  deadline: '6m',
}

// То, чего нет в карточке поиска: должность из списка анкеты, уровни навыков, направления
type Extra = Pick<MentorProfile, 'position' | 'experience' | 'skills' | 'directions' | 'format' | 'availability' | 'duration' | 'about'>

const EXTRA: Record<string, Extra> = {
  anna: {
    position: 'ML-инженер',
    experience: '5-10',
    skills: { Python: 'expert', 'Машинное обучение': 'expert', SQL: 'advanced', 'Аналитика данных': 'advanced' },
    directions: ['Освоение профессии', 'Подготовка к собеседованию', 'Карьерный рост'],
    format: 'mixed',
    availability: '3-5',
    duration: '6m',
    about: 'Senior Data Scientist в Яндексе. Помогаю войти в Data Science: Python, машинное обучение, подготовка к стажировке.',
  },
  eva: {
    position: 'Аналитик данных',
    experience: '3-5',
    skills: { SQL: 'expert', Python: 'advanced', 'Аналитика данных': 'expert' },
    directions: ['Подготовка к собеседованию', 'Карьерный рост'],
    format: 'online',
    availability: '6-10',
    duration: '3m',
    about: 'Продуктовый аналитик в Тинькофф, пришла в аналитику из маркетинга. Готовлю к собеседованиям на аналитика.',
  },
  ivan: {
    position: 'ML-инженер',
    experience: '5-10',
    skills: { Python: 'expert', 'Машинное обучение': 'advanced' },
    directions: ['Помощь с проектом', 'Ревью кода и работ'],
    format: 'mixed',
    availability: '3-5',
    duration: '6m',
    about: 'ML-инженер в Сбере: MLOps, вывод моделей в прод, Linux.',
  },
  maria: {
    position: 'Backend-разработчик',
    experience: '5-10',
    skills: { Python: 'confident' },
    directions: ['Освоение профессии', 'Карьерный рост'],
    format: 'online',
    availability: '1-2',
    duration: '6m',
    about: 'Специалист по информационной безопасности в Сбербанке: SIEM, Linux, расследование инцидентов.',
  },
  artur: {
    position: 'Аналитик данных',
    experience: '1-3',
    skills: { SQL: 'advanced', 'Аналитика данных': 'confident', Python: 'confident' },
    directions: ['Освоение профессии', 'Подготовка к собеседованию'],
    format: 'online',
    availability: '6-10',
    duration: '1m',
    about: 'Аналитик данных в Авито, недавно прошёл путь от джуна.',
  },
  olga: {
    position: 'Проектный менеджер',
    experience: '5-10',
    skills: { 'Управление проектами': 'expert', SQL: 'confident', 'Аналитика данных': 'confident' },
    directions: ['Карьерный рост', 'Soft skills'],
    format: 'mixed',
    availability: '3-5',
    duration: '6m',
    about: 'Продакт-менеджер в Ozon: продуктовые метрики, A/B-тесты, развитие продукта.',
  },
  dmitry: {
    position: 'Backend-разработчик',
    experience: '10+',
    skills: { SQL: 'expert' },
    directions: ['Ревью кода и работ', 'Помощь с проектом'],
    format: 'mixed',
    availability: '1-2',
    duration: '3m',
    about: 'Backend-разработчик в VK: Java, Go, высоконагруженные сервисы.',
  },
  kira: {
    position: 'UX/UI-дизайнер',
    experience: '3-5',
    skills: { Интерфейсы: 'expert' },
    directions: ['Освоение профессии', 'Ревью кода и работ'],
    format: 'mixed',
    availability: '3-5',
    duration: '3m',
    about: 'UX-исследователь в Контуре: интервью с пользователями, Figma, продуктовые гипотезы.',
  },
}

const toProfile = (mentor: SearchMentor): MentorProfile => ({
  id: mentor.id,
  first_name: mentor.name.split(' ')[0],
  city: mentor.city,
  language: 'ru',
  price_model: 'hour',
  price: mentor.price ?? 0,
  free_trial: mentor.price === null,
  rating: mentor.rating,
  reviews_count: mentor.reviews,
  ...EXTRA[mentor.id],
})

export const MENTOR_PROFILES: MentorProfile[] = SEARCH_MENTORS.filter((mentor) => mentor.id in EXTRA).map(toProfile)
