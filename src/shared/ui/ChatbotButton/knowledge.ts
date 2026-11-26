// Запасная база знаний: бот отвечает по ней, если ML-сервис недоступен

export type Topic = {
  question: string
  // Слова, по которым узнаём вопрос, написанный своими словами
  keywords: string[]
  answer: string
}

export const CURATOR_QUESTION = 'Связаться с куратором'

const COMPATIBILITY: Topic = {
  question: 'Как считается совместимость?',
  keywords: ['совместим', 'процент', 'подбор', 'мэтч'],
  answer:
    'ИИ сравнивает анкеты по навыкам, целям, интересам, уровню и опыту, графику, формату встреч, продолжительности и направлению. Каждый критерий даёт свой вклад, а итог показывается в процентах.',
}

const CURATOR: Topic = {
  question: CURATOR_QUESTION,
  keywords: ['куратор', 'поддержк', 'человек', 'оператор'],
  answer: 'Передал ваш вопрос куратору. Он ответит в разделе «Сообщения» в течение часа.',
}

const MENTOR_TOPICS: Topic[] = [
  {
    question: 'Как принять заявку?',
    keywords: ['заявк', 'принять', 'запрос'],
    answer:
      'Откройте заявку на главной в блоке «Новые запросы». Посмотрите анкету и процент совместимости, затем нажмите «Принять заявку». После этого откроются чат и контакты менти.',
  },
  {
    question: 'Как назначить встречу?',
    keywords: ['встреч', 'назнач', 'созвон', 'календар'],
    answer:
      'Откройте чат с менти в «Сообщениях» и нажмите «Назначить встречу». Укажите тему, дату, время, длительность и формат — менти получит приглашение.',
  },
  {
    question: 'Как оценить менти?',
    keywords: ['оцен', 'отзыв', 'рейтинг'],
    answer:
      'После создания пары в профиле менти появляется кнопка «Оценить». Поставьте общую оценку и оцените вовлечённость, выполнение заданий и пунктуальность.',
  },
  COMPATIBILITY,
  CURATOR,
]

const MENTEE_TOPICS: Topic[] = [
  {
    question: 'Как найти ментора?',
    keywords: ['найти', 'подобрать', 'ментор', 'наставник', 'поиск'],
    answer:
      'Откройте раздел «Менторы»: ИИ уже подобрал наставников под вашу анкету. Уточните выдачу фильтрами, а подходящих кандидатов добавьте в сравнение.',
  },
  {
    question: 'Как отправить заявку?',
    keywords: ['заявк', 'отправ'],
    answer:
      'В карточке наставника нажмите «Отправить заявку». Наставник обычно отвечает в течение 2 дней — ответ придёт в «Уведомления».',
  },
  {
    question: 'Как назначить встречу?',
    keywords: ['встреч', 'назнач', 'созвон', 'календар'],
    answer:
      'Откройте чат с наставником в «Сообщениях» и нажмите «Назначить встречу». Укажите тему, дату, время, длительность и формат.',
  },
  COMPATIBILITY,
  CURATOR,
]

export const topicsFor = (role: 'mentor' | 'mentee') => (role === 'mentor' ? MENTOR_TOPICS : MENTEE_TOPICS)

// Ответ без ИИ, после которого вопрос уходит куратору
export const isHandoff = (answer: string) => answer === FALLBACK || answer === CURATOR.answer

export const FALLBACK =
  'Пока не знаю ответа на этот вопрос. Передал его куратору — он ответит в разделе «Сообщения».'

// Ищем тему по точному вопросу или по ключевым словам
export function findAnswer(topics: Topic[], text: string) {
  const query = text.trim().toLowerCase()
  const exact = topics.find((topic) => topic.question.toLowerCase() === query)
  if (exact) return exact.answer
  let best: Topic | undefined
  let bestScore = 0
  for (const topic of topics) {
    const score = topic.keywords.filter((word) => query.includes(word)).length
    if (score > bestScore) {
      best = topic
      bestScore = score
    }
  }
  return best?.answer ?? FALLBACK
}
