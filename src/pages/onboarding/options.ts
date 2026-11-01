import type { DropdownOption } from '@/shared/ui/Dropdown/Dropdown'

export const ROLE_OPTIONS: DropdownOption[] = [
  { value: 'student', label: 'Я ищу наставника (менти)' },
  { value: 'mentor', label: 'Я хочу быть наставником (ментор)' },
]

// Подсказки для поля города, можно ввести и свой
export const CITY_OPTIONS: DropdownOption[] = [
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
].map((city) => ({ value: city, label: city }))

export const LANGUAGE_OPTIONS: DropdownOption[] = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'Английский' },
  { value: 'de', label: 'Немецкий' },
  { value: 'fr', label: 'Французский' },
  { value: 'es', label: 'Испанский' },
  { value: 'zh', label: 'Китайский' },
]
