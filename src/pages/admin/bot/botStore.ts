import { createStore } from '../createStore'

export type ChatStatus = 'Ждёт оператора' | 'В работе' | 'Завершён'

export const CHAT_STATUSES: ChatStatus[] = ['Ждёт оператора', 'В работе', 'Завершён']

// system — служебная строка посередине: «бот передал диалог куратору» и т. п.
export type ChatMessage = {
  id: string
  from: 'user' | 'bot' | 'curator' | 'system'
  text: string
  time: string
}

export type BotChat = {
  id: string
  // Пользователь из админки; у гостей с сайта профиля нет
  userId?: string
  name: string
  role: 'Ментор' | 'Менти'
  initials: string
  color: string
  status: ChatStatus
  messages: ChatMessage[]
}

const CHATS: BotChat[] = [
  {
    id: 'irina',
    userId: 'irina',
    name: 'Ирина Белова',
    role: 'Менти',
    initials: 'ИБ',
    color: '#27ae60',
    status: 'Ждёт оператора',
    messages: [
      { id: 'm1', from: 'user', text: 'Как сменить наставника?', time: '14:20' },
      {
        id: 'm2',
        from: 'bot',
        text: 'Напишите куратору через ИИ-бота или оставьте обращение в карточке пары. Куратор инициирует повторный подбор.',
        time: '14:20',
      },
      { id: 'm3', from: 'user', text: 'Я уже оставляла обращение, но ответа нет. Можно поговорить с куратором?', time: '14:31' },
      { id: 'm4', from: 'system', text: 'Пользователь попросил оператора', time: '14:32' },
    ],
  },
  {
    id: 'timur',
    userId: 'timur',
    name: 'Тимур Ахметов',
    role: 'Менти',
    initials: 'ТА',
    color: '#56ccf2',
    status: 'Ждёт оператора',
    messages: [
      { id: 'm1', from: 'user', text: 'Где посмотреть запись вебинара про собеседования?', time: '13:05' },
      { id: 'm2', from: 'bot', text: 'Не нашёл ответа в базе знаний. Передаю вопрос куратору — он ответит здесь же.', time: '13:05' },
      { id: 'm3', from: 'system', text: 'Бот передал диалог куратору', time: '13:05' },
    ],
  },
  {
    id: 'anna',
    userId: 'anna',
    name: 'Анна Сапрыкина',
    role: 'Ментор',
    initials: 'АС',
    color: '#7c6cf2',
    status: 'В работе',
    messages: [
      { id: 'm1', from: 'user', text: 'Как изменить стоимость занятий в профиле?', time: '11:40' },
      { id: 'm2', from: 'bot', text: 'Стоимость указана в карточке каждого ментора. Изменить её можно в разделе «Профиль».', time: '11:40' },
      { id: 'm3', from: 'user', text: 'В профиле поле неактивно, не получается поменять', time: '11:42' },
      { id: 'm4', from: 'system', text: 'Бот передал диалог куратору', time: '11:42' },
      { id: 'm5', from: 'curator', text: 'Здравствуйте, Анна! Проверяю ваш профиль, вернусь с ответом в течение часа.', time: '11:50' },
    ],
  },
  {
    id: 'dmitry',
    userId: 'dmitry',
    name: 'Дмитрий Ко',
    role: 'Ментор',
    initials: 'ДК',
    color: '#2f80ed',
    status: 'Завершён',
    messages: [
      { id: 'm1', from: 'user', text: 'Менти не выходит на связь вторую неделю, что делать?', time: 'вчера' },
      { id: 'm2', from: 'system', text: 'Бот передал диалог куратору', time: 'вчера' },
      { id: 'm3', from: 'curator', text: 'Дмитрий, спасибо, что написали. Запустили повторный подбор для вашей пары.', time: 'вчера' },
      { id: 'm4', from: 'system', text: 'Куратор завершил диалог', time: 'вчера' },
    ],
  },
]

// Сохраняется в браузере: сайт и админка могут быть открыты в разных вкладках
const store = createStore(CHATS, 'kurator.botChats.v1')

export const useChats = store.use

const now = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

const update = (id: string, change: (chat: BotChat) => BotChat) =>
  store.set((list) => list.map((chat) => (chat.id === id ? change(chat) : chat)))

// Ответ куратора: диалог переходит в работу
export const sendReply = (id: string, text: string) =>
  update(id, (chat) => ({
    ...chat,
    status: 'В работе',
    messages: [...chat.messages, { id: crypto.randomUUID(), from: 'curator', text, time: now() }],
  }))

type SiteUser = { id: string; name: string; role: BotChat['role']; initials: string; color: string }

// Бот на сайте передал вопрос куратору: добавляем новые реплики и ставим диалог в очередь
export function receiveHandoff(user: SiteUser, messages: { from: 'user' | 'bot'; text: string }[]) {
  const time = now()
  const added: ChatMessage[] = [
    ...messages.map((message) => ({ id: crypto.randomUUID(), from: message.from, text: message.text, time })),
    { id: crypto.randomUUID(), from: 'system', text: 'Бот передал диалог куратору', time },
  ]
  store.set((list) => {
    const existing = list.find((chat) => chat.id === user.id)
    const chat: BotChat = existing
      ? { ...existing, status: 'Ждёт оператора', messages: [...existing.messages, ...added] }
      : { ...user, status: 'Ждёт оператора', messages: added }
    // Свежий диалог — наверх списка
    return [chat, ...list.filter((item) => item.id !== user.id)]
  })
}

// Пока диалог у куратора, сообщения пользователя идут ему, а не боту
export const receiveUserMessage = (id: string, text: string) =>
  update(id, (chat) => ({ ...chat, messages: [...chat.messages, { id: crypto.randomUUID(), from: 'user', text, time: now() }] }))

// Куратор закрывает диалог, дальше снова отвечает бот
export const closeChat = (id: string) =>
  update(id, (chat) => ({
    ...chat,
    status: 'Завершён',
    messages: [...chat.messages, { id: crypto.randomUUID(), from: 'system', text: 'Куратор завершил диалог', time: now() }],
  }))
