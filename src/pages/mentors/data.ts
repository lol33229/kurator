// Моковые данные подбора, пока нет API

export type Format = 'онлайн' | 'очно' | 'смешанный'

export type SearchMentor = {
  id: string
  name: string
  initials: string
  color: string
  position: string
  company: string
  direction: string
  skills: string[]
  experience: number
  formats: Format[]
  hoursPerWeek: number
  // Сколько месяцев может длиться наставничество
  durations: number[]
  // null — бесплатно
  price: number | null
  rating: number
  reviews: number
  city: string
  languages: string[]
  compatibility: number
  reasons: string[]
}

export const SEARCH_MENTORS: SearchMentor[] = [
  {
    id: 'anna',
    name: 'Анна Сапрыкина',
    initials: 'АС',
    color: '#7c6cf2',
    position: 'Senior Data Scientist',
    company: 'Яндекс',
    direction: 'Data Science',
    skills: ['Python', 'ML', 'SQL', 'Data Analysis', 'Deep Learning'],
    experience: 8,
    formats: ['онлайн', 'смешанный'],
    hoursPerWeek: 4,
    durations: [3, 6],
    price: 2500,
    rating: 4.9,
    reviews: 42,
    city: 'Москва',
    languages: ['Русский', 'English'],
    compatibility: 94,
    reasons: ['Совпадает цель: стажировка в Data Science', 'Владеет 4 из 5 ваших целевых навыков', 'Свободна в удобное вам время'],
  },
  {
    id: 'eva',
    name: 'Ева Алексеева',
    initials: 'ЕА',
    color: '#e07a5f',
    position: 'Product Analyst',
    company: 'Тинькофф',
    direction: 'Аналитика',
    skills: ['SQL', 'Python', 'A/B тесты', 'Data Analysis'],
    experience: 5,
    formats: ['онлайн'],
    hoursPerWeek: 6,
    durations: [1, 3],
    price: 1500,
    rating: 4.8,
    reviews: 27,
    city: 'Санкт-Петербург',
    languages: ['Русский'],
    compatibility: 91,
    reasons: ['Помогает с подготовкой к собеседованиям', 'Опыт перехода из смежной сферы, как у вас'],
  },
  {
    id: 'ivan',
    name: 'Иван Шестаков',
    initials: 'ИШ',
    color: '#3d9970',
    position: 'ML Engineer',
    company: 'Сбер',
    direction: 'Data Science',
    skills: ['Python', 'ML', 'MLOps', 'Linux'],
    experience: 6,
    formats: ['онлайн', 'очно'],
    hoursPerWeek: 3,
    durations: [3, 6],
    price: 2000,
    rating: 4.7,
    reviews: 19,
    city: 'Москва',
    languages: ['Русский'],
    compatibility: 87,
    reasons: ['Совпадает цель: освоить MLOps', 'Живёт в вашем городе — возможны очные встречи'],
  },
  {
    id: 'maria',
    name: 'Мария Иванова',
    initials: 'МИ',
    color: '#d65db1',
    position: 'Специалист по ИБ',
    company: 'Сбербанк',
    direction: 'Информационная безопасность',
    skills: ['SIEM', 'Linux', 'Python'],
    experience: 7,
    formats: ['онлайн'],
    hoursPerWeek: 2,
    durations: [1, 3, 6],
    price: null,
    rating: 4.9,
    reviews: 35,
    city: 'Москва',
    languages: ['Русский'],
    compatibility: 78,
    reasons: ['Бесплатное наставничество', 'Высокий рейтинг среди менти'],
  },
  {
    id: 'artur',
    name: 'Артур Кузнецов',
    initials: 'АК',
    color: '#56ccf2',
    position: 'Data Analyst',
    company: 'Авито',
    direction: 'Аналитика',
    skills: ['SQL', 'Data Analysis', 'Python'],
    experience: 3,
    formats: ['онлайн'],
    hoursPerWeek: 6,
    durations: [1],
    price: 800,
    rating: 4.5,
    reviews: 8,
    city: 'Новосибирск',
    languages: [],
    compatibility: 64,
    reasons: ['Недавно прошёл путь джуна — понимает ваши задачи'],
  },
  {
    id: 'olga',
    name: 'Ольга Морозова',
    initials: 'ОМ',
    color: '#f2994a',
    position: 'Product Manager',
    company: 'Ozon',
    direction: 'Менеджмент продукта',
    skills: ['Product', 'A/B тесты', 'SQL'],
    experience: 9,
    formats: ['онлайн', 'смешанный'],
    hoursPerWeek: 4,
    durations: [3, 6],
    price: 3000,
    rating: 4.8,
    reviews: 31,
    city: 'Москва',
    languages: ['Русский', 'English'],
    compatibility: 72,
    reasons: ['Поможет разобраться в продуктовых метриках', 'Свободна в удобное вам время'],
  },
  {
    id: 'dmitry',
    name: 'Дмитрий Орлов',
    initials: 'ДО',
    color: '#2f80ed',
    position: 'Backend Developer',
    company: 'VK',
    direction: 'Разработка',
    skills: ['Java', 'Go', 'SQL', 'Linux'],
    experience: 10,
    formats: ['онлайн', 'очно'],
    hoursPerWeek: 2,
    durations: [1, 3],
    price: 3500,
    rating: 4.6,
    reviews: 22,
    city: 'Казань',
    languages: ['Русский'],
    compatibility: 61,
    reasons: ['Владеет SQL на продвинутом уровне'],
  },
  {
    id: 'kira',
    name: 'Кира Лебедева',
    initials: 'КЛ',
    color: '#9b51e0',
    position: 'UX Researcher',
    company: 'Контур',
    direction: 'Дизайн',
    skills: ['UX research', 'Figma', 'Product'],
    experience: 4,
    formats: ['смешанный'],
    hoursPerWeek: 4,
    durations: [1, 3],
    price: 1200,
    rating: 4.7,
    reviews: 14,
    city: 'Екатеринбург',
    languages: ['Русский', 'English'],
    compatibility: 62,
    reasons: ['Поможет с исследованиями пользователей'],
  },
]

export const SKILL_FILTERS = [
  'Python',
  'ML',
  'SQL',
  'Data Analysis',
  'Deep Learning',
  'MLOps',
  'Java',
  'Go',
  'Figma',
  'UX research',
  'SIEM',
  'Linux',
  'Product',
  'A/B тесты',
]

export const DIRECTION_FILTERS = [
  'Data Science',
  'Аналитика',
  'Разработка',
  'Дизайн',
  'Информационная безопасность',
  'Менеджмент продукта',
]

export const FORMAT_FILTERS: { value: Format; label: string }[] = [
  { value: 'онлайн', label: 'Онлайн' },
  { value: 'очно', label: 'Очно' },
  { value: 'смешанный', label: 'Смешанный' },
]

export const MAX_PRICE = 5000
export const MAX_COMPARE = 3
// С какой совместимости показываем плашку «Лучшее совпадение»
export const BEST_MATCH = 90

// Склонение: 1 год, 2 года, 5 лет
export function plural(count: number, one: string, few: string, many: string) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few
  return many
}

export const formatMoney = (value: number) => `${value.toLocaleString('ru-RU')} ₽`

export const formatPrice = (mentor: SearchMentor) => (mentor.price === null ? 'Бесплатно' : `${formatMoney(mentor.price)} / час`)

export const formatExperience = (years: number) => `${years} ${plural(years, 'год', 'года', 'лет')}`

export const formatFormats = (mentor: SearchMentor) => mentor.formats.join(', ')

export const formatDurations = (mentor: SearchMentor) => mentor.durations.map((months) => `${months} мес`).join(' / ')

export const formatReviews = (count: number) => `${count} ${plural(count, 'отзыв', 'отзыва', 'отзывов')}`

export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
