import type { DropdownOption } from '@/shared/ui/Dropdown/Dropdown'

const toOptions = (labels: string[]): DropdownOption[] => labels.map((label) => ({ value: label, label }))

export const ROLE_OPTIONS: DropdownOption[] = [
  { value: 'student', label: 'Я ищу наставника (менти)' },
  { value: 'mentor', label: 'Я хочу быть наставником (ментор)' },
]

// Подсказки для поля города, можно ввести и свой
export const CITY_OPTIONS = toOptions([
  'Москва',
  'Санкт-Петербург',
  'Новосибирск',
  'Екатеринбург',
  'Казань',
  'Нижний Новгород',
  'Челябинск',
  'Красноярск',
  'Самара',
  'Уфа',
  'Ростов-на-Дону',
  'Омск',
  'Краснодар',
  'Воронеж',
  'Пермь',
  'Волгоград',
])

export const LANGUAGE_OPTIONS: DropdownOption[] = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'Английский' },
  { value: 'de', label: 'Немецкий' },
  { value: 'fr', label: 'Французский' },
  { value: 'es', label: 'Испанский' },
  { value: 'zh', label: 'Китайский' },
]

export const SKILL_OPTIONS = toOptions([
  'Интерфейсы',
  'Графический дизайн',
  'C#',
  'Python',
  'JavaScript',
  'React',
  'SQL',
  'Аналитика данных',
  'Машинное обучение',
  'Управление проектами',
  'Маркетинг',
])

export const LEVEL_OPTIONS: DropdownOption[] = [
  { value: 'beginner', label: 'Начинающий' },
  { value: 'basic', label: 'Базовый' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' },
]

export const TASK_OPTIONS = toOptions([
  'Освоить новую профессию',
  'Подготовиться к собеседованию',
  'Разобраться в рабочем проекте',
  'Построить карьерный план',
  'Прокачать навыки',
  'Получить обратную связь по работам',
])

export const FORMAT_OPTIONS: DropdownOption[] = [
  { value: 'online', label: 'Онлайн' },
  { value: 'offline', label: 'Офлайн' },
  { value: 'mixed', label: 'Смешанный' },
]

export const DEADLINE_OPTIONS: DropdownOption[] = [
  { value: '1m', label: '1 месяц' },
  { value: '3m', label: '3 месяца' },
  { value: '6m', label: '6 месяцев' },
  { value: '6m+', label: 'Больше 6 месяцев' },
]

export const AVAILABILITY_OPTIONS: DropdownOption[] = [
  { value: '1-2', label: '1–2 часа в неделю' },
  { value: '3-5', label: '3–5 часов в неделю' },
  { value: '6-10', label: '6–10 часов в неделю' },
  { value: '10+', label: 'Более 10 часов в неделю' },
]
