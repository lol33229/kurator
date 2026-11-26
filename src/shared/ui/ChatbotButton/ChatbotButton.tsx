import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import botButton from '@/assets/chatbot/bot.svg'
import botIcon from '@/assets/chatbot/bot-icon.svg'
import sendIcon from '@/assets/chatbot/send.svg'
import { askChatbot, type KnowledgeDocument } from '@/shared/api/chatbot'
import { findAnswer, isHandoff, topicsFor } from './knowledge'
import styles from './ChatbotButton.module.css'

type Message = { id: number; from: 'bot' | 'user'; text: string; feedback?: 'up' | 'down' }

export type HandoffMessage = { from: 'user' | 'bot'; text: string }

type ChatbotButtonProps = {
  userName: string
  role: 'mentor' | 'mentee'
  // База знаний из админки; без неё сервис берёт встроенную
  knowledge?: KnowledgeDocument[]
  // Бот передал вопрос куратору: отдаём реплики, которых куратор ещё не видел
  onHandoff?: (messages: HandoffMessage[]) => void
}

// Плавающая кнопка ИИ-помощника и его окно
export function ChatbotButton({ userName, role, knowledge, onHandoff }: ChatbotButtonProps) {
  const titleId = useId()
  const topics = topicsFor(role)
  const greeting = `Здравствуйте, ${userName}! 👋 Я ИИ-помощник платформы. Подскажу, как работать с ${
    role === 'mentor' ? 'заявками, встречами и менти' : 'подбором наставников, заявками и встречами'
  }. Выберите вопрос ниже или напишите свой.`

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ id: 0, from: 'bot', text: greeting }])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Сколько реплик (без приветствия) уже передано куратору
  const handedOff = useRef(1)

  // Новое сообщение внизу: прокручиваем ленту до конца
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages, typing, open])

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKeyDown = (event: globalThis.KeyboardEvent) => event.key === 'Escape' && close()
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  function close() {
    setOpen(false)
    buttonRef.current?.focus()
  }

  const ask = async (text: string) => {
    const question = text.trim()
    if (!question || typing) return
    const userMessage: Message = { id: Date.now(), from: 'user', text: question }
    setMessages((list) => [...list, userMessage])
    setDraft('')
    setTyping(true)

    let answer: string
    let handoff: boolean
    try {
      const reply = await askChatbot({ userId: `demo-${role}`, question, role, knowledge })
      answer = reply.answer
      handoff = reply.handoff_to_curator
    } catch {
      // Сервис не запущен или не ответил — отвечаем по запасной базе
      answer = findAnswer(topics, question)
      handoff = isHandoff(answer)
    }

    const botMessage: Message = { id: Date.now() + 1, from: 'bot', text: answer }
    const all = [...messages, userMessage, botMessage]
    setMessages(all)
    setTyping(false)
    if (handoff) {
      onHandoff?.(all.slice(handedOff.current).map(({ from, text }) => ({ from, text })))
      handedOff.current = all.length
    }
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    void ask(draft)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void ask(draft)
    }
  }

  const rate = (id: number, feedback: 'up' | 'down') =>
    setMessages((list) => list.map((message) => (message.id === id ? { ...message, feedback } : message)))

  return (
    <>
      {!open && (
        <button ref={buttonRef} type="button" className={styles.button} aria-label="Открыть ИИ-помощника" onClick={() => setOpen(true)}>
          <img src={botButton} alt="" width={80} height={83.5} />
        </button>
      )}

      {open && (
        <section className={styles.panel} role="dialog" aria-labelledby={titleId}>
          <header className={styles.head}>
            <span className={styles.logo}>
              <img src={botIcon} alt="" width={20} height={20} />
            </span>
            <div className={styles.headText}>
              <h2 id={titleId} className={styles.title}>
                ИИ-помощник Куратора
              </h2>
              <p className={styles.status}>
                <span aria-hidden="true">● </span>в сети · отвечает сразу
              </p>
            </div>
            <button type="button" className={styles.close} onClick={close} aria-label="Закрыть">
              ✕
            </button>
          </header>

          <div ref={listRef} className={styles.messages} role="log" aria-live="polite">
            <p className={styles.day}>Сегодня</p>
            {messages.map((message, index) =>
              message.from === 'user' ? (
                <p key={message.id} className={`${styles.bubble} ${styles.user}`}>
                  {message.text}
                </p>
              ) : (
                <div key={message.id} className={`${styles.bubble} ${styles.bot}`}>
                  <span className={styles.botName}>ИИ-бот</span>
                  <p>{message.text}</p>
                  {/* Приветствие не оцениваем */}
                  {index > 0 && (
                    <div className={styles.feedback}>
                      Ответ помог?
                      <button
                        type="button"
                        className={[styles.rate, message.feedback === 'up' && styles.rateActive].filter(Boolean).join(' ')}
                        aria-pressed={message.feedback === 'up'}
                        aria-label="Да, помог"
                        onClick={() => rate(message.id, 'up')}
                      >
                        👍
                      </button>
                      <button
                        type="button"
                        className={[styles.rate, message.feedback === 'down' && styles.rateActive].filter(Boolean).join(' ')}
                        aria-pressed={message.feedback === 'down'}
                        aria-label="Нет, не помог"
                        onClick={() => rate(message.id, 'down')}
                      >
                        👎
                      </button>
                    </div>
                  )}
                </div>
              ),
            )}
            {typing && <p className={`${styles.bubble} ${styles.bot} ${styles.typing}`}>ИИ-бот печатает…</p>}
          </div>

          <div className={styles.quick} aria-label="Частые вопросы">
            {topics.map((topic) => (
              <button key={topic.question} type="button" className={styles.chip} onClick={() => void ask(topic.question)} disabled={typing}>
                {topic.question}
              </button>
            ))}
          </div>

          <form className={styles.composer} onSubmit={submit}>
            <textarea
              ref={inputRef}
              className={styles.input}
              rows={1}
              placeholder="Задайте вопрос…"
              aria-label="Вопрос"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
            />
            <button type="submit" className={styles.send} disabled={!draft.trim() || typing} aria-label="Отправить">
              <img src={sendIcon} alt="" width={20} height={20} />
            </button>
          </form>
          <p className={styles.note}>Бот отвечает по базе знаний. Если он не знает ответа — подключится куратор.</p>
        </section>
      )}
    </>
  )
}
