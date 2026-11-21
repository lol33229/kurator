import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import botButton from '@/assets/chatbot/bot.svg'
import botIcon from '@/assets/chatbot/bot-icon.svg'
import sendIcon from '@/assets/chatbot/send.svg'
import { findAnswer, topicsFor } from './knowledge'
import styles from './ChatbotButton.module.css'

type Message = { id: number; from: 'bot' | 'user'; text: string; feedback?: 'up' | 'down' }

type ChatbotButtonProps = {
  userName: string
  role: 'mentor' | 'mentee'
}

// Сколько «думает» бот перед ответом
const REPLY_DELAY = 500

// Плавающая кнопка ИИ-помощника и его окно
export function ChatbotButton({ userName, role }: ChatbotButtonProps) {
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

  const ask = (text: string) => {
    const question = text.trim()
    if (!question || typing) return
    setMessages((list) => [...list, { id: Date.now(), from: 'user', text: question }])
    setDraft('')
    setTyping(true)
    window.setTimeout(() => {
      setMessages((list) => [...list, { id: Date.now() + 1, from: 'bot', text: findAnswer(topics, question) }])
      setTyping(false)
    }, REPLY_DELAY)
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    ask(draft)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      ask(draft)
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
              <button key={topic.question} type="button" className={styles.chip} onClick={() => ask(topic.question)} disabled={typing}>
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
