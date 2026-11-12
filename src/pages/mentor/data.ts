import menteeArtur from '@/assets/mentor/mentee-artur.png'
import menteeElena from '@/assets/mentor/mentee-elena.png'
import menteeMaria from '@/assets/mentor/mentee-maria.png'
import userAvatar from '@/assets/mentor/user-avatar.png'

// Моковые данные, пока нет API
export const MENTOR = {
  firstName: 'Антон',
  shortName: 'Антон К.',
  avatar: userAvatar,
}

export type MenteeRequest = {
  id: string
  name: string
  position: string
  goal: string
  compatibility: number
  photo: string
}

export const REQUESTS: MenteeRequest[] = [
  {
    id: 'elena',
    name: 'Елена В.',
    position: 'Студентка, 2 курс',
    goal: 'Стать специалистом в Data Science',
    compatibility: 87,
    photo: menteeElena,
  },
  {
    id: 'artur',
    name: 'Артур К.',
    position: 'Junior аналитик',
    goal: 'Развиться в аналитике и перейти в DS',
    compatibility: 65,
    photo: menteeArtur,
  },
]

export const EVENTS = [
  { id: 'e1', date: '2026-04-15', day: 15, month: 'апр', title: 'Встреча с Марией В.', time: '17:00 - 18:00', place: 'Очно' },
  { id: 'e2', date: '2026-05-11', day: 11, month: 'мая', title: 'Встреча с Еленой А.', time: '17:00 - 18:00', place: 'Онлайн' },
  { id: 'e3', date: '2026-05-12', day: 12, month: 'мая', title: 'Вебинар от Сбера', time: '11:00 - 12:00', place: 'Онлайн' },
]

// Месяц, который календарь показывает первым
export const CALENDAR_START = new Date(2026, 3, 1)

export const MENTEES = [
  {
    id: 'artur',
    name: 'Артур Королев',
    goal: 'Развиться в аналитике и перейти в DS',
    nextMeeting: '24 апр, 16:00',
    progress: 83,
    photo: menteeArtur,
  },
  {
    id: 'maria',
    name: 'Мария Туран',
    goal: 'Стать специалистом в Data Science',
    nextMeeting: '25 апр, 16:00',
    progress: 67,
    photo: menteeMaria,
  },
  { id: 'lev', name: 'Лев Агной', goal: 'Подготовка к переходу в Senior', nextMeeting: null, progress: 20, photo: menteeArtur },
]
