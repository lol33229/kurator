import type { SkillLevel } from './ProfileParts'

// Списки и помощники для редактирования профиля

export const LEVELS = ['Базовый', 'Уверенный', 'Продвинутый', 'Эксперт']

export const DIRECTIONS = [
  'Карьерный рост',
  'Смена профессии',
  'Soft Skills',
  'Подготовка к собеседованию',
  'Портфолио',
  'Лидерство',
  'Code review',
]

export const POPULAR_SKILLS = ['Deep Learning', 'Статистика', 'Pandas', 'A/B тесты', 'MLOps', 'Git']

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export const TIMEZONES = ['МСК −1', 'МСК', 'МСК +1', 'МСК +2', 'МСК +3', 'МСК +4', 'МСК +5', 'МСК +6', 'МСК +7', 'МСК +8', 'МСК +9']

export const MEETING_FORMATS = ['Онлайн', 'Офлайн']

export const GOAL_TERMS = ['1 месяц', '3 месяца', '6 месяцев', '12 месяцев']

export const PRICE_MODELS = ['За час', 'За сессию', 'Пакет занятий', 'Подписка на месяц', 'Бесплатно']

// Пустые строки отбрасываем, имена обрезаем
export const cleanSkills = (rows: SkillLevel[]) =>
  rows.map((row) => ({ ...row, skill: row.skill.trim() })).filter((row) => row.skill)

// 1 год, 2 года, 5 лет
export function yearsLabel(value: string) {
  const count = Number(value)
  if (!Number.isFinite(count)) return value
  const mod10 = count % 10
  const mod100 = count % 100
  const word = mod10 === 1 && mod100 !== 11 ? 'год' : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? 'года' : 'лет'
  return `${count} ${word}`
}
