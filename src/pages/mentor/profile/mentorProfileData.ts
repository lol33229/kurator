import headerAvatar from '@/assets/mentor/user-avatar.png'
import profilePhoto from '@/assets/mentor/profile-photo.png'
import menteeEva from '@/assets/student/mentor-eva.png'
import menteeIvan from '@/assets/student/mentor-ivan.png'
import type { HistoryItem, Review, SkillLevel } from '@/pages/profile/ProfileParts'

// Моковые данные профиля ментора, пока нет API
export const PROFILE = {
  shortName: 'Алексей С.',
  headerAvatar,
  photo: profilePhoto,
  fields: [
    { label: 'Имя и фамилия', value: 'Алексей Смирнов' },
    { label: 'Возраст', value: '30 лет' },
    { label: 'Статус', value: 'Ментор' },
    { label: 'Образование', value: 'УрФУ, Программная инженерия' },
    { label: 'Город', value: 'Екатеринбург, Россия' },
    { label: 'О себе', value: 'Интересуюсь аналитикой данных и машинным обучением.' },
  ],
}

export const SKILLS: SkillLevel[] = [
  { skill: 'Python', level: 'Базовый' },
  { skill: 'ML', level: 'Продвинутый' },
  { skill: 'SQL', level: 'Уверенный' },
  { skill: 'Data Analysis', level: 'Эксперт' },
]

export const EXPERIENCE = [
  { id: 'urfu', title: 'УрФУ - Исследователь (стажировка)', period: '2018 - 2019 год' },
  { id: 'sber', title: 'Сбер - Data Science', period: '2019 - 2022 год' },
  { id: 'yandex', title: 'Яндекс - Senior Data Science', period: '2022 - сейчас' },
]

export const PROJECTS = [
  { id: 'recsys', title: 'Оптимизация рекомендательной системы', description: 'Разработка и внедрение ML-модели' },
  {
    id: 'platform',
    title: 'Аналитическая платформа',
    description: 'Участие в создании внутренней платформы для анализа данных',
  },
]

export const AVAILABILITY = {
  days: 'Пн, Ср, Пт',
  time: '18:00 - 21:00 (МСК +2)',
  format: 'Онлайн, оффлайн (Екатеринбург)',
  price: '1 час / 1000 рублей',
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
