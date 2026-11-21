import type { SkillLevel } from '@/pages/profile/ProfileParts'

// Моковые данные, пока нет API

export type MatchFactor = {
  label: string
  value: number
  // Как показывать значение, например «4 из 5»
  valueLabel?: string
  note: string
}

export type MenteeDetails = {
  id: string
  name: string
  initials: string
  color: string
  subtitle: string
  timezone: string
  languages: string
  requestDate: string
  pairSince: string
  about: { label: string; value: string }[]
  skills: SkillLevel[]
  // Навыки, которые менти ждёт от наставника; matched — есть в профиле ментора
  wantedSkills: { name: string; matched: boolean }[]
  level: string
  tasks: string[]
  format: string
  availability: string
  budget: string
  goal: { title: string; term: string; deadline: string }
  compatibility: number
  factors: MatchFactor[]
  responseDays: number
  nextMeeting: { day: number; month: string; title: string; time: string }
}

export const LEVELS = ['Нет опыта', 'Начинающий', 'Средний', 'Продвинутый']

// Полная анкета из макета; остальные менти строятся от неё
const ALEKSEY: MenteeDetails = {
  id: 'aleksey',
  name: 'Алексей Смирнов',
  initials: 'АС',
  color: '#f4a261',
  subtitle: 'Менти · хочет перейти в Data Science',
  timezone: 'UTC+3, Москва',
  languages: 'Русский, English (B2)',
  requestDate: '14 ноября',
  pairSince: '14 ноября 2026',
  about: [
    { label: 'Имя и фамилия', value: 'Алексей Смирнов' },
    { label: 'Возраст', value: '20 лет' },
    { label: 'Статус', value: 'Студент, 3 курс' },
    { label: 'Образование', value: 'ВШЭ, Прикладная информатика' },
    { label: 'Город', value: 'Екатеринбург, Россия' },
    {
      label: 'О себе',
      value: 'Интересуюсь аналитикой данных и машинным обучением. Хочу развиваться в Data Science и построить карьеру в ИТ.',
    },
  ],
  skills: [
    { skill: 'Python', level: 'Базовый' },
    { skill: 'ML', level: 'Продвинутый' },
    { skill: 'SQL', level: 'Уверенный' },
    { skill: 'Data Analysis', level: 'Эксперт' },
  ],
  wantedSkills: [
    { name: 'Python', matched: true },
    { name: 'Machine Learning', matched: true },
    { name: 'SQL', matched: true },
    { name: 'MLOps', matched: false },
    { name: 'Подготовка к собеседованиям', matched: true },
  ],
  level: 'Начинающий',
  tasks: [
    'Составить план обучения на 6 месяцев',
    'Разобрать pet-проекты и собрать портфолио на GitHub',
    'Подготовиться к техническому собеседованию на стажировку',
    'Понять, как устроена работа DS-команды в продукте',
  ],
  format: 'Онлайн, иногда очно',
  availability: '4–6 часов в неделю',
  budget: 'до 3 000 ₽ / час',
  goal: { title: 'Получить стажировку в Data Science', term: '6 месяцев', deadline: 'до мая 2027' },
  compatibility: 94,
  factors: [
    { label: 'Навыки', value: 90, valueLabel: '4 из 5', note: 'Python, ML, SQL, собеседования совпадают' },
    { label: 'Цель', value: 100, note: 'Вы помогали 6 менти получить стажировку в DS' },
    { label: 'Формат', value: 100, note: 'Онлайн — как у вас' },
    { label: 'Доступность', value: 85, note: 'У вас 4 ч/нед, менти хочет 4–6' },
    { label: 'Бюджет', value: 100, note: 'Ваша ставка 2 500 ₽ входит в бюджет' },
    { label: 'Часовой пояс', value: 100, note: 'Совпадает: UTC+3' },
  ],
  responseDays: 2,
  nextMeeting: { day: 18, month: 'нояб', title: 'Разбор резюме', time: '17:00 – 18:00 · Онлайн' },
}

type Overrides = Partial<MenteeDetails> & Pick<MenteeDetails, 'id' | 'name' | 'initials' | 'color' | 'subtitle' | 'compatibility'>

const like = (overrides: Overrides): MenteeDetails => ({
  ...ALEKSEY,
  ...overrides,
  about: [{ label: 'Имя и фамилия', value: overrides.name }, ...ALEKSEY.about.slice(1)],
})

// Менти и заявки с главной ментора
export const MENTEE_DETAILS: MenteeDetails[] = [
  ALEKSEY,
  like({
    id: 'elena',
    name: 'Елена Волкова',
    initials: 'ЕВ',
    color: '#d65db1',
    subtitle: 'Студентка, 2 курс · хочет стать специалистом в Data Science',
    compatibility: 87,
    goal: { title: 'Стать специалистом в Data Science', term: '6 месяцев', deadline: 'до мая 2027' },
  }),
  like({
    id: 'artur',
    name: 'Артур Королев',
    initials: 'АК',
    color: '#56ccf2',
    subtitle: 'Junior аналитик · хочет перейти в Data Science',
    compatibility: 65,
    goal: { title: 'Развиться в аналитике и перейти в DS', term: '6 месяцев', deadline: 'до мая 2027' },
  }),
  like({
    id: 'maria',
    name: 'Мария Туран',
    initials: 'МТ',
    color: '#7c6cf2',
    subtitle: 'Менти · хочет стать специалистом в Data Science',
    compatibility: 91,
    goal: { title: 'Стать специалистом в Data Science', term: '3 месяца', deadline: 'до февраля 2027' },
  }),
  like({
    id: 'lev',
    name: 'Лев Агной',
    initials: 'ЛА',
    color: '#3d9970',
    subtitle: 'Middle Data Scientist · готовится к переходу в Senior',
    compatibility: 78,
    level: 'Средний',
    goal: { title: 'Подготовка к переходу в Senior', term: '6 месяцев', deadline: 'до мая 2027' },
  }),
]

export const findMentee = (id: string | undefined) => MENTEE_DETAILS.find((mentee) => mentee.id === id)
