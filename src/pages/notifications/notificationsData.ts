// Моковые уведомления менти, пока нет API

export type NotificationCategory = 'requests' | 'meetings' | 'messages' | 'platform'
export type NotificationIcon = 'check' | 'calendar' | 'plane' | 'rocket' | 'chartPie' | 'bot' | 'file'
export type NotificationTone = 'green' | 'lime' | 'blue' | 'pink' | 'orange' | 'violet'

// Текст с выделенными жирным частями: чётные куски обычные, нечётные жирные
export type RichText = string[]

export type NotificationAction =
  | { label: string; primary?: boolean; to: string }
  | { label: string; primary?: boolean; effect: 'acceptMeeting' | 'declineMeeting' }

export type AppNotification = {
  id: string
  group: string
  category: NotificationCategory
  icon: NotificationIcon
  tone: NotificationTone
  title: RichText
  text: string
  time: string
  unread: boolean
  actions: NotificationAction[]
}

export const CATEGORY_TABS: { value: NotificationCategory | 'all' | 'unread'; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'unread', label: 'Непрочитанные' },
  { value: 'requests', label: 'Заявки' },
  { value: 'meetings', label: 'Встречи' },
  { value: 'messages', label: 'Сообщения' },
  { value: 'platform', label: 'Платформа' },
]

export const NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    group: 'Сегодня',
    category: 'requests',
    icon: 'check',
    tone: 'green',
    title: ['', 'Иван Шестаков', ' принял вашу заявку'],
    text: 'Теперь вы пара! Напишите наставнику, чтобы договориться о первой встрече.',
    time: '10:40',
    unread: true,
    actions: [
      { label: 'Написать', primary: true, to: '/messages' },
      { label: 'Профиль', to: '/mentors' },
    ],
  },
  {
    id: 'n2',
    group: 'Сегодня',
    category: 'meetings',
    icon: 'calendar',
    tone: 'lime',
    title: ['Напоминание: встреча с ', 'Анной Сапрыкиной', ' через 1 час'],
    text: '«Разбор решения по регрессии» · 17:00 – 18:00 · Онлайн',
    time: '16:00',
    unread: true,
    actions: [
      { label: 'Подключиться', primary: true, to: '/messages' },
      { label: 'Перенести', to: '/messages' },
    ],
  },
  {
    id: 'n3',
    group: 'Сегодня',
    category: 'messages',
    icon: 'plane',
    tone: 'blue',
    title: ['', 'Мария Иванова', ' ответила вам'],
    text: '«Да, конечно. Четверг в 17:00 подойдёт?»',
    time: '14:02',
    unread: true,
    actions: [{ label: 'Ответить', to: '/messages' }],
  },
  {
    id: 'n4',
    group: 'Вчера',
    category: 'meetings',
    icon: 'calendar',
    tone: 'lime',
    title: ['', 'Анна Сапрыкина', ' приглашает на встречу'],
    text: '«Подготовка к собеседованию» · 18 ноября, 17:00 · Онлайн',
    time: '19:20',
    unread: false,
    actions: [
      { label: 'Принять', primary: true, effect: 'acceptMeeting' },
      { label: 'Отклонить', effect: 'declineMeeting' },
    ],
  },
  {
    id: 'n5',
    group: 'Вчера',
    category: 'platform',
    icon: 'rocket',
    tone: 'pink',
    title: ['Прогресс по цели «Стажировка в Data Science» — ', '78%'],
    text: 'Осталось 2 шага: пройти mock-интервью и обновить резюме.',
    time: '12:00',
    unread: false,
    actions: [],
  },
  {
    id: 'n6',
    group: 'Ранее',
    category: 'requests',
    icon: 'chartPie',
    tone: 'orange',
    title: ['Заявка ', 'Ольге Ли', ' ожидает ответа'],
    text: 'Наставник обычно отвечает в течение 2 дней.',
    time: '10 нояб.',
    unread: false,
    actions: [{ label: 'Смотреть других менторов', to: '/mentors' }],
  },
  {
    id: 'n7',
    group: 'Ранее',
    category: 'platform',
    icon: 'bot',
    tone: 'violet',
    title: ['ИИ подобрал ', '3 новых наставника', ' для вас'],
    text: 'Совместимость от 87% — посмотрите рекомендации.',
    time: '8 нояб.',
    unread: false,
    actions: [{ label: 'Посмотреть', primary: true, to: '/mentors' }],
  },
  {
    id: 'n8',
    group: 'Ранее',
    category: 'platform',
    icon: 'file',
    tone: 'violet',
    title: ['Вебинар «Как пройти собеседование в ИТ-компанию?»'],
    text: '12 декабря в 16:00 · Онлайн',
    time: '8 нояб.',
    unread: false,
    actions: [{ label: 'Читать', to: '/news/interview-webinar' }],
  },
]
