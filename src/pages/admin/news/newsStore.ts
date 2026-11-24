import androidIcon from '@/assets/admin/android.svg'
import calendarIcon from '@/assets/admin/calendar.svg'
import rocketIcon from '@/assets/admin/rocket.svg'
import { createStore } from '../createStore'

// icon — значок на зелёном фоне, image — загруженная картинка
export type AdminNews = {
  id: string
  title: string
  text: string
  date: string
  icon?: string
  image?: string
}

const NEWS: AdminNews[] = [
  {
    id: 'matching',
    title: 'ИИ-подбор наставников стал точнее',
    text: 'Мы обновили алгоритм мэтчинга: теперь он учитывает не только навыки, но и ваши цели, удобное время и формат встреч.',
    date: '12.11.2026',
    icon: androidIcon,
  },
  {
    id: 'webinar',
    title: 'Вебинар «Как пройти собеседование в ИТ-компанию?»',
    text: '12 декабря в 16:00 Анна Сапрыкина из Яндекса расскажет, как готовиться к техническим и поведенческим интервью.',
    date: '08.11.2026',
    icon: calendarIcon,
  },
  {
    id: 'compare',
    title: 'Новый раздел «Сравнение наставников»',
    text: 'Добавляйте до трёх менторов в сравнение и смотрите опыт, стоимость, формат и доступность в одной таблице.',
    date: '03.11.2026',
    icon: rocketIcon,
  },
  {
    id: 'autumn',
    title: 'Итоги осеннего набора: 1 200 новых пар',
    text: 'Рассказываем, какие направления были самыми популярными и сколько менти уже достигли своих первых целей.',
    date: '28.10.2026',
  },
]

const store = createStore(NEWS)

export const useNews = store.use

export const addNews = (item: Omit<AdminNews, 'id' | 'date'>) =>
  store.set((list) => [{ ...item, id: crypto.randomUUID(), date: new Date().toLocaleDateString('ru-RU') }, ...list])

export const updateNews = (id: string, patch: Partial<AdminNews>) =>
  store.set((list) => list.map((item) => (item.id === id ? { ...item, ...patch } : item)))

export const removeNews = (id: string) => store.set((list) => list.filter((item) => item.id !== id))
