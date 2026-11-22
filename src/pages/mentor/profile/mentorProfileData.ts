import headerAvatar from '@/assets/mentor/user-avatar.png'
import profilePhoto from '@/assets/mentor/profile-photo.png'
import menteeEva from '@/assets/student/mentor-eva.png'
import menteeIvan from '@/assets/student/mentor-ivan.png'
import type { AvailabilityData, PersonalData } from '@/pages/profile/EditableSections'
import type { HistoryItem, Review, SkillLevel } from '@/pages/profile/ProfileParts'

// Моковые данные профиля ментора, пока нет API
export const PROFILE = {
  shortName: 'Алексей С.',
  headerAvatar,
  photo: profilePhoto,
  personal: {
    firstName: 'Алексей',
    lastName: 'Смирнов',
    age: '30',
    status: 'Ментор',
    university: 'УрФУ',
    specialty: 'Программная инженерия',
    city: 'Екатеринбург, Россия',
    about: 'Интересуюсь аналитикой данных и машинным обучением.',
  } satisfies PersonalData,
}

export const SKILLS: SkillLevel[] = [
  { skill: 'Python', level: 'Базовый' },
  { skill: 'ML', level: 'Продвинутый' },
  { skill: 'SQL', level: 'Уверенный' },
  { skill: 'Data Analysis', level: 'Эксперт' },
]

export type Job = { id: string; company: string; position: string; from: string; to: string; current: boolean }

export const EXPERIENCE: Job[] = [
  { id: 'urfu', company: 'УрФУ', position: 'Исследователь (стажировка)', from: '2018', to: '2019', current: false },
  { id: 'sber', company: 'Сбер', position: 'Data Science', from: '2019', to: '2022', current: false },
  { id: 'yandex', company: 'Яндекс', position: 'Senior Data Science', from: '2022', to: '', current: true },
]

export const PROJECTS = [
  { id: 'recsys', title: 'Оптимизация рекомендательной системы', description: 'Разработка и внедрение ML-модели' },
  {
    id: 'platform',
    title: 'Аналитическая платформа',
    description: 'Участие в создании внутренней платформы для анализа данных',
  },
]

export const AVAILABILITY: AvailabilityData = {
  days: ['Пн', 'Ср', 'Пт'],
  from: '18:00',
  to: '21:00',
  timezone: 'МСК +2',
  formats: ['Онлайн', 'Офлайн'],
  city: 'Екатеринбург',
  priceModel: 'За час',
  price: '1000',
}

export const MENTORSHIP = {
  directions: ['Карьерный рост', 'Смена профессии', 'Soft Skills'],
  menteeLevels: [
    { skill: 'Python', level: 'Базовый' },
    { skill: 'ML', level: 'Продвинутый' },
    { skill: 'SQL', level: 'Уверенный' },
  ] satisfies SkillLevel[],
}

export const HISTORY: HistoryItem[] = [
  {
    id: 'ivan',
    name: 'Иван Ш.',
    position: 'Студент, 1 курс',
    photo: menteeIvan,
    current: true,
    period: 'С 12 фев 2026',
    goal: 'Подготовиться к собеседованию в ИТ',
    progress: 32,
  },
  {
    id: 'eva',
    name: 'Ева А.',
    position: 'Студентка, 2 курс',
    photo: menteeEva,
    current: false,
    period: 'Май 2025 - Дек 2025',
    goal: 'Освоить аналитику данных',
    progress: 100,
  },
]

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Иван Ш.',
    position: 'Студент, 4 курс',
    photo: menteeIvan,
    rating: 5,
    date: '10 апр 2026',
    text: 'Алексей отличный специалист, приятно работать',
  },
  {
    id: 'r2',
    name: 'Ева А.',
    position: 'Студентка, 1 курс',
    photo: menteeEva,
    rating: 5,
    date: '10 апр 2025',
    text: 'Умный молодой человек, помог со всем',
  },
]
