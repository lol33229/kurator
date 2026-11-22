import profilePhoto from '@/assets/student/mentor-maria.png'
import mentorEva from '@/assets/student/mentor-eva.png'
import mentorIvan from '@/assets/student/mentor-ivan.png'
import headerAvatar from '@/assets/student/user-avatar.png'
import type { AvailabilityData, PersonalData } from '@/pages/profile/EditableSections'

// Моковые данные профиля, пока нет API
export const PROFILE = {
  shortName: 'Анна С.',
  headerAvatar,
  photo: profilePhoto,
  personal: {
    firstName: 'Анна',
    lastName: 'Смирнова',
    age: '20',
    status: 'Студентка, 3 курс',
    university: 'ВШЭ',
    specialty: 'Прикладная информатика',
    city: 'Екатеринбург, Россия',
    about: 'Интересуюсь аналитикой данных и машинным обучением. Хочу развиваться в Data Science и построить карьеру в ИТ.',
  } satisfies PersonalData,
}

export const SKILLS = [
  { skill: 'Python', level: 'Базовый' },
  { skill: 'ML', level: 'Продвинутый' },
  { skill: 'SQL', level: 'Уверенный' },
  { skill: 'Data Analysis', level: 'Эксперт' },
]

export type Goal = {
  id: string
  title: string
  term: string
  directions: string[]
  description?: string
  progress: number
}

export const GOALS: Goal[] = [
  {
    id: 'internship',
    title: 'Стажировка в Data Science',
    term: '6 месяцев',
    directions: ['Карьерный рост', 'Смена профессии', 'Soft Skills'],
    description: 'Развить навыки и попасть на первую стажировку за 6 месяцев',
    progress: 78,
  },
  {
    id: 'interview',
    title: 'Подготовиться к собеседованию в ИТ',
    term: '3 месяца',
    directions: ['Карьерный рост', 'Смена профессии', 'Soft Skills'],
    description: 'Составить резюме, портфолио и пройти пробные интервью',
    progress: 32,
  },
]

export const AVAILABILITY: AvailabilityData = {
  days: ['Пн', 'Ср', 'Пт'],
  from: '18:00',
  to: '21:00',
  timezone: 'МСК +2',
  formats: ['Онлайн', 'Офлайн'],
  city: 'Екатеринбург',
}

export const HISTORY = [
  {
    id: 'ivan',
    name: 'Иван Ш.',
    position: 'ML Engineer',
    photo: mentorIvan,
    current: true,
    period: 'С 12 фев 2026',
    goal: 'Подготовиться к собеседованию в ИТ',
    progress: 32,
  },
  {
    id: 'eva',
    name: 'Ева А.',
    position: 'Product Analyst',
    photo: mentorEva,
    current: false,
    period: 'Май 2025 - Дек 2025',
    goal: 'Освоить аналитику данных',
    progress: 100,
  },
]

export const REVIEWS = [
  {
    id: 'r1',
    name: 'Иван Ш.',
    position: 'ML Engineer',
    photo: mentorIvan,
    rating: 5,
    date: '10 апр 2026',
    text: 'Анна - вовлеченная и ответственная ученица. Быстро учится и активно работает!',
  },
  {
    id: 'r2',
    name: 'Ева А.',
    position: 'Product Analyst',
    photo: mentorEva,
    rating: 5,
    date: '10 апр 2025',
    text: 'Очень приятно работать с Анной, улавливает быстро.',
  },
]
