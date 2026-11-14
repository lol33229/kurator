import profilePhoto from '@/assets/student/mentor-maria.png'
import mentorEva from '@/assets/student/mentor-eva.png'
import mentorIvan from '@/assets/student/mentor-ivan.png'
import headerAvatar from '@/assets/student/user-avatar.png'

// Моковые данные профиля, пока нет API
export const PROFILE = {
  shortName: 'Анна С.',
  headerAvatar,
  photo: profilePhoto,
  fields: [
    { label: 'Имя и фамилия', value: 'Анна Смирнова' },
    { label: 'Возраст', value: '20 лет' },
    { label: 'Статус', value: 'Студентка, 3 курс' },
    { label: 'Направление обучения', value: 'Прикладная информатика' },
    { label: 'Город', value: 'Екатеринбург, Россия' },
    {
      label: 'О себе',
      value: 'Интересуюсь аналитикой данных и машинным обучением. Хочу развиваться в Data Science и построить карьеру в ИТ.',
    },
  ],
}

export const SKILLS = [
  { skill: 'Python', level: 'Базовый' },
  { skill: 'ML', level: 'Продвинутый' },
  { skill: 'SQL', level: 'Уверенный' },
  { skill: 'Data Analysis', level: 'Эксперт' },
]

// Цели складываются из задач, выбранных в анкете («с чем нужна помощь»)
export const GOALS = [
  {
    task: 'Освоить новую профессию',
    title: 'Стажировка в Data Science',
    description: 'Развить навыки и попасть на первую стажировку за 6 месяцев',
    progress: 78,
  },
  {
    task: 'Подготовиться к собеседованию',
    title: 'Подготовиться к собеседованию в ИТ',
    description: 'Составить резюме, портфолио и пройти пробные интервью',
    progress: 32,
  },
]

export const AVAILABILITY = {
  days: 'Пн, Ср, Пт',
  time: '18:00 - 21:00 (МСК +2)',
  format: 'Онлайн, оффлайн (Екатеринбург)',
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
