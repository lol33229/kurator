import { createStore } from '../createStore'

// Материал базы знаний: бот узнаёт вопрос по формулировкам и отвечает текстом answer
export type KnowledgeItem = {
  id: string
  title: string
  questions: string[]
  answer: string
  updated: string
}

const ITEMS: KnowledgeItem[] = [
  {
    id: 'request',
    title: 'Как отправить заявку наставнику',
    questions: ['Как отправить заявку?', 'Как выбрать ментора?', 'Где кнопка «Отправить заявку»?'],
    answer:
      'Откройте раздел «Менторы», выберите наставника и нажмите «Отправить заявку» в его карточке. Наставник получит уведомление и ответит в течение 2 дней.',
    updated: '14.11.2026',
  },
  {
    id: 'reschedule',
    title: 'Как перенести встречу',
    questions: ['Как перенести встречу?', 'Можно ли поменять время встречи?'],
    answer: 'Откройте встречу в разделе «События» и нажмите «Перенести». Предупредите вторую сторону минимум за сутки.',
    updated: '10.11.2026',
  },
  {
    id: 'change-mentor',
    title: 'Как сменить наставника',
    questions: ['Хочу другого наставника', 'Как сменить ментора?'],
    answer: 'Напишите куратору через ИИ-бота или оставьте обращение в карточке пары. Куратор инициирует повторный подбор.',
    updated: '02.11.2026',
  },
  {
    id: 'price',
    title: 'Стоимость наставничества',
    questions: ['Сколько стоит ментор?', 'Наставничество платное?'],
    answer: 'Стоимость указана в карточке каждого ментора. Есть наставники, которые занимаются бесплатно — их можно найти через фильтр.',
    updated: '28.10.2026',
  },
  {
    id: 'complaint',
    title: 'Как пожаловаться на пользователя',
    questions: ['Как подать жалобу?', 'Наставник ведёт себя некорректно'],
    answer: 'Откройте профиль пользователя и нажмите «Пожаловаться». Куратор рассмотрит жалобу в течение суток.',
    updated: '20.10.2026',
  },
]

const store = createStore(ITEMS)

export const useKnowledge = store.use

const today = () => new Date().toLocaleDateString('ru-RU')

export const addKnowledge = (item: Omit<KnowledgeItem, 'id' | 'updated'>) =>
  store.set((list) => [{ ...item, id: crypto.randomUUID(), updated: today() }, ...list])

export const updateKnowledge = (id: string, patch: Omit<KnowledgeItem, 'id' | 'updated'>) =>
  store.set((list) => list.map((item) => (item.id === id ? { ...item, ...patch, updated: today() } : item)))

export const removeKnowledge = (id: string) => store.set((list) => list.filter((item) => item.id !== id))
