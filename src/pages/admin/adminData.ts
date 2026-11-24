// Тестовые данные панели куратора

export type UserRole = 'Ментор' | 'Менти' | 'Куратор'
export type UserStatus = 'Активен' | 'Заблокирован' | 'На проверке'

export type AdminUser = {
  id: string
  name: string
  city: string
  email: string
  role: UserRole
  status: UserStatus
  registered: string
  color: string
  // Сколько предупреждений уже получил
  warnings?: number
}

export const USER_ROLES: UserRole[] = ['Ментор', 'Менти', 'Куратор']

export const CURATOR = { firstName: 'Елена', shortName: 'Елена К.', initials: 'ЕК', color: '#e07a5f' }

export const USERS: AdminUser[] = [
  { id: 'anna', name: 'Анна Сапрыкина', city: 'Москва', email: 'anna.s@mail.ru', role: 'Ментор', status: 'Активен', registered: '12.03.2026', color: '#7c6cf2' },
  { id: 'maria', name: 'Мария Иванова', city: 'Казань', email: 'm.ivanova@mail.ru', role: 'Ментор', status: 'Активен', registered: '20.01.2026', color: '#d65db1' },
  { id: 'ivan', name: 'Иван Шестаков', city: 'Москва', email: 'ivan.sh@mail.ru', role: 'Ментор', status: 'Активен', registered: '05.05.2026', color: '#3d9970' },
  { id: 'dmitry', name: 'Дмитрий Ко', city: 'Москва', email: 'd.ko@mail.ru', role: 'Ментор', status: 'Активен', registered: '17.06.2026', color: '#2f80ed' },
  { id: 'irina', name: 'Ирина Белова', city: 'Санкт-Петербург', email: 'belova.i@mail.ru', role: 'Менти', status: 'Активен', registered: '01.09.2026', color: '#27ae60' },
  { id: 'kirill', name: 'Кирилл Петров', city: 'Самара', email: 'kirill.p@mail.ru', role: 'Менти', status: 'Заблокирован', registered: '14.08.2026', color: '#9b51e0', warnings: 2 },
  { id: 'olga', name: 'Ольга Ли', city: '', email: 'olga.li@mail.ru', role: 'Ментор', status: 'На проверке', registered: '13.11.2026', color: '#f2994a' },
  { id: 'timur', name: 'Тимур Ахметов', city: 'Уфа', email: 'timur.a@mail.ru', role: 'Менти', status: 'Активен', registered: '21.10.2026', color: '#56ccf2' },
  { id: 'elena', name: 'Елена Козлова', city: 'Москва', email: 'kozlova@kurator.ru', role: 'Куратор', status: 'Активен', registered: '01.01.2026', color: '#e07a5f' },
]

export const STATS = [
  { label: 'Пользователи', value: '1240', note: '▲ 38 за неделю', tone: 'up' },
  { label: 'Активные пары', value: '186', note: '▲ 12 за неделю', tone: 'up' },
  { label: 'Новые жалобы', value: '2', note: '▲ 1 за сутки', tone: 'alert' },
  { label: 'Ждут ответа куратора', value: '2', note: 'в ИИ-боте', tone: 'muted' },
] as const

type Person = { initials: string; color: string; name: string; email: string }

export type PairStatus = 'Активна' | 'Требует внимания' | 'Повторный подбор' | 'Завершена'

export const PAIR_STATUSES: PairStatus[] = ['Активна', 'Требует внимания', 'Повторный подбор', 'Завершена']

// Обращение участника пары к куратору
export type Appeal = {
  id: string
  from: 'mentor' | 'mentee'
  date: string
  text: string
  status: 'Новое' | 'Решено'
}

// compatibility — null, пока идёт повторный подбор
export type Pair = {
  id: string
  number: number
  mentorId: string
  menteeId: string
  mentor: Person
  mentee: Person
  names: string
  goal: string
  compatibility: number | null
  progress: number
  meetings: number
  started: string
  status: PairStatus
  factors: { label: string; value: number }[]
  appeals: Appeal[]
}

const anna = { initials: 'АС', color: '#7c6cf2', name: 'Анна Сапрыкина', email: 'anna.s@mail.ru' }
const aleksey = { initials: 'АС', color: '#f4a261', name: 'Алексей Смирнов', email: 'a.smirnov@mail.ru' }
const maria = { initials: 'МИ', color: '#d65db1', name: 'Мария Иванова', email: 'm.ivanova@mail.ru' }
const irina = { initials: 'ИБ', color: '#27ae60', name: 'Ирина Белова', email: 'belova.i@mail.ru' }
const ivan = { initials: 'ИШ', color: '#3d9970', name: 'Иван Шестаков', email: 'ivan.sh@mail.ru' }
const timur = { initials: 'ТА', color: '#56ccf2', name: 'Тимур Ахметов', email: 'timur.a@mail.ru' }
const dmitry = { initials: 'ДК', color: '#2f80ed', name: 'Дмитрий Ко', email: 'd.ko@mail.ru' }
const kirill = { initials: 'КП', color: '#9b51e0', name: 'Кирилл Петров', email: 'kirill.p@mail.ru' }

// Факторы с заданными значениями: навыки, цель, формат, доступность, бюджет, часовой пояс
const factors = (...values: number[]) =>
  ['Навыки', 'Цель', 'Формат', 'Доступность', 'Бюджет', 'Часовой пояс'].map((label, index) => ({ label, value: values[index] }))

export const PAIRS: Pair[] = [
  {
    id: 'anna-aleksey', number: 1, mentorId: 'anna', menteeId: 'aleksey', mentor: anna, mentee: aleksey,
    names: 'Анна и Алексей', goal: 'Стажировка в Data Science', compatibility: 94, progress: 12, meetings: 1,
    started: '14.11.2026', status: 'Активна', factors: factors(95, 100, 90, 85, 100, 95), appeals: [],
  },
  {
    id: 'maria-irina', number: 2, mentorId: 'maria', menteeId: 'irina', mentor: maria, mentee: irina,
    names: 'Мария и Ирина', goal: 'Основы информационной безопасности', compatibility: 78, progress: 35, meetings: 4,
    started: '03.09.2026', status: 'Требует внимания', factors: factors(70, 90, 100, 45, 100, 100),
    appeals: [
      { id: 'a1', from: 'mentee', date: '12.11.2026', text: 'Ментор третий раз переносит встречу, хочу понять, сможем ли продолжить в прежнем темпе.', status: 'Новое' },
      { id: 'a2', from: 'mentor', date: '13.11.2026', text: 'Сейчас много работы, могу выделять только 2 часа в неделю вместо 4.', status: 'Решено' },
    ],
  },
  {
    id: 'ivan-timur', number: 3, mentorId: 'ivan', menteeId: 'timur', mentor: ivan, mentee: timur,
    names: 'Иван и Тимур', goal: 'Освоить MLOps', compatibility: 87, progress: 8, meetings: 2,
    started: '10.11.2026', status: 'Активна', factors: factors(90, 85, 80, 90, 100, 75), appeals: [],
  },
  {
    id: 'dmitry-kirill', number: 4, mentorId: 'dmitry', menteeId: 'kirill', mentor: dmitry, mentee: kirill,
    names: 'Дмитрий и Кирилл', goal: 'Первая работа backend-разработчиком', compatibility: null, progress: 40, meetings: 6,
    started: '20.08.2026', status: 'Повторный подбор', factors: factors(60, 70, 50, 30, 80, 100), appeals: [],
  },
  {
    id: 'anna-irina', number: 5, mentorId: 'anna', menteeId: 'irina', mentor: anna, mentee: irina,
    names: 'Анна и Ирина', goal: 'Подготовка к собеседованию', compatibility: 91, progress: 100, meetings: 12,
    started: '15.03.2026', status: 'Завершена', factors: factors(95, 90, 100, 80, 85, 100), appeals: [],
  },
]

export type ComplaintStatus = 'Новая' | 'На рассмотрении' | 'Решена'

export const COMPLAINT_STATUSES: ComplaintStatus[] = ['Новая', 'На рассмотрении', 'Решена']

// userId — на кого пожаловались, from — кто пожаловался
export type Complaint = {
  id: string
  number: number
  userId: string
  from: string
  fromRole: string
  reason: string
  comment: string
  date: string
  status: ComplaintStatus
}

export const COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    number: 1,
    userId: 'maria',
    from: 'Ирина Белова',
    fromRole: 'менти',
    reason: 'Не выходит на связь / пропускает встречи',
    comment: 'Наставница третий раз переносит встречу в последний момент. Предупреждает за 10 минут до начала.',
    date: '13.11.2026',
    status: 'Новая',
  },
  {
    id: 'c2',
    number: 2,
    userId: 'dmitry',
    from: 'Тимур Ахметов',
    fromRole: 'менти',
    reason: 'Некорректное поведение',
    comment: 'Резко ответил на вопрос по заданию и отказался объяснять подробнее.',
    date: '12.11.2026',
    status: 'Новая',
  },
  {
    id: 'c3',
    number: 3,
    userId: 'kirill',
    from: 'Анна Сапрыкина',
    fromRole: 'ментор',
    reason: 'Спам или реклама',
    comment: 'Присылает в чат ссылки на платные курсы вместо вопросов по задачам.',
    date: '08.11.2026',
    status: 'Решена',
  },
  {
    id: 'c4',
    number: 4,
    userId: 'ivan',
    from: 'Алексей Смирнов',
    fromRole: 'менти',
    reason: 'Другое',
    comment: 'Не отвечает на сообщения больше недели.',
    date: '05.11.2026',
    status: 'На рассмотрении',
  },
]

// Пункты бокового меню; badge — счётчик справа
export const NAV = [
  { to: '/admin', label: 'Дашборд', end: true },
  { to: '/admin/users', label: 'Пользователи' },
  { to: '/admin/pairs', label: 'Подбор пар', badge: 1, muted: true },
  { to: '/admin/complaints', label: 'Жалобы', badge: 2 },
  { to: '/admin/knowledge', label: 'База знаний' },
  { to: '/admin/news', label: 'Новости' },
  { to: '/admin/bot', label: 'ИИ-бот', badge: 2 },
]

// Причины предупреждения
export const WARNING_REASONS = ['Нарушение правил общения', 'Пропуск встреч без предупреждения', 'Спам или реклама', 'Другое']

// После стольких предупреждений аккаунт блокируется
export const WARNINGS_LIMIT = 3

export const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
