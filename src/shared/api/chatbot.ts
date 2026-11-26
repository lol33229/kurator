// Запросы к чат-боту ML-сервиса

// Адрес сервиса можно поменять в .env.local: VITE_ML_URL=http://...
const ML_URL = import.meta.env.VITE_ML_URL ?? 'http://localhost:8001'

// Сколько ждём ответа модели, потом отвечаем без сервиса
const TIMEOUT_MS = 25_000

export type KnowledgeDocument = {
  id: string
  title: string
  questions: string[]
  answer: string
  audience?: 'all' | 'mentor' | 'mentee'
}

export type ChatbotReply = {
  answer: string
  sources: { document_id: string; title: string; fragment: string }[]
  confidence: number
  handoff_to_curator: boolean
}

type AskParams = {
  userId: string
  question: string
  role: 'mentor' | 'mentee'
  knowledge?: KnowledgeDocument[]
}

// Бросает ошибку, если сервис не запущен или не ответил вовремя
export async function askChatbot({ userId, question, role, knowledge }: AskParams): Promise<ChatbotReply> {
  const response = await fetch(`${ML_URL}/chatbot/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, question, role, knowledge }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`ML-сервис ответил ${response.status}`)
  return response.json()
}
