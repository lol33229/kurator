// Моковые чаты менти, пока нет API

export type ChatFile = { name: string; size: string; type: string }

export type ChatMessage =
  | { id: string; kind: 'text'; from: 'me' | 'them'; day: string; time: string; text: string; file?: ChatFile }
  // Системное событие, например назначенная встреча
  | { id: string; kind: 'event'; day: string; text: string }

export type Chat = {
  id: string
  name: string
  initials: string
  color: string
  // Подпись под именем в шапке чата
  about: string
  online: boolean
  unread: number
  goal?: { title: string; progress: number }
  messages: ChatMessage[]
}

export const CHATS: Chat[] = [
  {
    id: 'anna',
    name: 'Анна Сапрыкина',
    initials: 'АС',
    color: '#7c6cf2',
    about: 'Senior Data Scientist · Яндекс',
    online: true,
    unread: 0,
    goal: { title: 'Стажировка в Data Science', progress: 78 },
    messages: [
      {
        id: 'a1',
        kind: 'text',
        from: 'them',
        day: 'Вчера',
        time: '18:42',
        text: 'Привет, Алексей! Посмотрела твоё решение по задаче с регрессией — в целом отлично 👍',
      },
      {
        id: 'a2',
        kind: 'text',
        from: 'them',
        day: 'Вчера',
        time: '18:43',
        text: 'Обрати внимание на подбор признаков, там можно улучшить метрику',
      },
      { id: 'a3', kind: 'text', from: 'me', day: 'Вчера', time: '19:05', text: 'Спасибо! Переделаю и пришлю сегодня вечером' },
      { id: 'a4', kind: 'event', day: 'Сегодня', text: 'Встреча назначена · 18 ноября, 17:00 · Онлайн' },
      {
        id: 'a5',
        kind: 'text',
        from: 'me',
        day: 'Сегодня',
        time: '10:12',
        text: 'Вот обновлённый ноутбук',
        file: { name: 'regression_v2.ipynb', size: '184 КБ', type: 'IPYN' },
      },
      { id: 'a6', kind: 'text', from: 'them', day: 'Сегодня', time: '10:30', text: 'Получила, посмотрю до встречи' },
      { id: 'a7', kind: 'text', from: 'them', day: 'Сегодня', time: '10:31', text: 'И подготовь, пожалуйста, вопросы по MLOps 🙂' },
    ],
  },
  {
    id: 'maria',
    name: 'Мария Иванова',
    initials: 'МИ',
    color: '#d65db1',
    about: 'Специалист по ИБ · Сбербанк',
    online: false,
    unread: 1,
    goal: { title: 'Основы информационной безопасности', progress: 35 },
    messages: [
      {
        id: 'm1',
        kind: 'text',
        from: 'me',
        day: 'Сегодня',
        time: '13:50',
        text: 'Здравствуйте! Можно перенести нашу встречу на эту неделю?',
      },
      { id: 'm2', kind: 'text', from: 'them', day: 'Сегодня', time: '14:02', text: 'Да, конечно. Четверг в 17:00 подойдёт?' },
    ],
  },
  {
    id: 'ivan',
    name: 'Иван Шестаков',
    initials: 'ИШ',
    color: '#3d9970',
    about: 'ML Engineer · Сбер',
    online: true,
    unread: 0,
    messages: [
      {
        id: 'i1',
        kind: 'text',
        from: 'me',
        day: 'Сегодня',
        time: '09:40',
        text: 'Привет! Хочу понять, как выкатывать модели в прод',
      },
    ],
  },
  {
    id: 'support',
    name: 'Поддержка Куратора',
    initials: 'K',
    color: '#1d2236',
    about: 'Отвечаем в течение часа',
    online: true,
    unread: 0,
    messages: [
      { id: 's1', kind: 'text', from: 'me', day: 'Сегодня', time: '11:52', text: 'Не приходит письмо для подтверждения почты' },
      {
        id: 's2',
        kind: 'text',
        from: 'them',
        day: 'Сегодня',
        time: '12:10',
        text: 'Проверили — письмо отправлено повторно. Загляните в папку «Спам».',
      },
    ],
  },
]

// Последнее сообщение для списка чатов
export function lastMessage(chat: Chat) {
  const texts = chat.messages.filter((message) => message.kind === 'text')
  return texts[texts.length - 1]
}
