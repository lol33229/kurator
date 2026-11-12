import mentorAnna from '@/assets/student/mentor-anna.png'
import mentorEva from '@/assets/student/mentor-eva.png'
import mentorIvan from '@/assets/student/mentor-ivan.png'
import mentorMaria from '@/assets/student/mentor-maria.png'
import userAvatar from '@/assets/student/user-avatar.png'

// Моковые данные, пока нет API
export const STUDENT = {
  firstName: 'Алексей',
  shortName: 'Алексей С.',
  avatar: userAvatar,
}

export type Mentor = {
  id: string
  name: string
  position: string
  company: string
  photo: string
  tags: string[]
  // Сколько навыков не поместилось в карточку
  moreTags?: number
}

export const MY_MENTORS: Mentor[] = [
  {
    id: 'anna',
    name: 'Анна Сапрыкина',
    position: 'Senior Data Scientist',
    company: 'Яндекс',
    photo: mentorAnna,
    tags: ['Python', 'ML', 'SQL', 'Data Analysis'],
    moreTags: 2,
  },
  {
    id: 'maria',
    name: 'Мария Иванова',
    position: 'Специалист по информационной безопасности',
    company: 'Сбербанк',
    photo: mentorMaria,
    tags: ['SIEM', 'Linux', 'Windows'],
  },
]

export type RequestStatus = 'pending' | 'accepted'

export const REQUESTS: { id: string; name: string; position: string; photo: string; status: RequestStatus }[] = [
  { id: 'ivan', name: 'Иван Ш.', position: 'ML Engineer', photo: mentorIvan, status: 'pending' },
  { id: 'artur', name: 'Артур К.', position: 'ML Engineer', photo: mentorIvan, status: 'accepted' },
]

export const SUGGESTIONS = [
  { id: 'eva', name: 'Ева А.', position: 'Product Analyst', photo: mentorEva, compatibility: 94 },
  { id: 'ivan', name: 'Иван Ш.', position: 'ML Engineer', photo: mentorIvan, compatibility: 87 },
]

export const EVENTS = [
  { id: 'e1', day: 12, month: 'дек', title: 'Вебинар «Как пройти собеседование в ИТ-компанию?»', time: '16:00 - 17:30', place: 'Онлайн' },
  { id: 'e2', day: 22, month: 'фев', title: 'Мастер-класс по ML от Яндекса', time: '11:00 - 15:00', place: 'Онлайн' },
  { id: 'e3', day: 11, month: 'мая', title: 'Встреча с Марией Ивановой', time: '17:00 - 18:00', place: 'Очно' },
  { id: 'e4', day: 12, month: 'мая', title: 'Встреча с Анной Сапрыкиной', time: '17:00 - 18:00', place: 'Очно' },
]

export const GOAL = {
  title: 'Стажировка в Data Science',
  description: 'Развить навыки и попасть на первую стажировку за 6 месяцев',
  progress: 78,
}
