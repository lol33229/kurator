import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import botButton from '@/assets/chatbot/bot.svg'
import botIcon from '@/assets/chatbot/bot-icon.svg'
import sendIcon from '@/assets/chatbot/send.svg'
import { askChatbot, type KnowledgeDocument } from '@/shared/api/chatbot'
import { findAnswer, isHandoff, topicsFor } from './knowledge'
import styles from './ChatbotButton.module.css'

// synced — реплика уже передана куратору; quiet — служебная, без оценки «Ответ помог?»
type Message = {
  id: string
  from: 'bot' | 'user' | 'curator'
  text: string
  feedback?: 'up' | 'down'
  synced?: boolean
  quiet?: boolean
}

export type HandoffMessage = { from: 'user' | 'bot'; text: string }

// Диалог у куратора: active — куратор на связи, replies — его ответы
export type CuratorState = { active: boolean; replies: { id: string; text: string }[] }

const NO_CURATOR: CuratorState = { active: false, replies: [] }

let lastId = 0
const nextId = () => String(++lastId)

type ChatbotButtonProps = {
  userName: string
  role: 'mentor' | 'mentee'
  // База знаний из админки; без неё сервис берёт встроенную
  knowledge?: KnowledgeDocument[]
  // Бот передал вопрос куратору: отдаём реплики, которых куратор ещё не видел
  onHandoff?: (messages: HandoffMessage[]) => void
  curator?: CuratorState
  // Пока куратор на связи, сообщения пользователя идут ему
  onUserMessage?: (text: string) => void
}

// Плавающая кнопка ИИ-помощника и его окно
export function ChatbotButton({ userName, role, knowledge, onHandoff, curator = NO_CURATOR, onUserMessage }: ChatbotButtonProps) {
  const titleId = useId()
  const topics = topicsFor(role)
  const greeting = `Здравствуйте, ${userName}! 👋 Я ИИ-помощник платформы. Подскажу, как работать с ${
    role === 'mentor' ? 'заявками, встречами и менти' : 'подбором наставников, заявками и встречами'
  }. Выберите вопрос ниже или напишите свой.`

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ id: 'greeting', from: 'bot', text: greeting, synced: true, quiet: true }])
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // Новый ответ куратора, пока окно закрыто
  const [unread, setUnread] = useState(false)
  // Ответы куратора, которые уже показаны; старые из прошлых сессий не дублируем
  const shown = useRef(new Set(curator.replies.map((reply) => reply.id)))
  const wasActive = useRef(curator.active)

  // Пришёл ответ куратора — добавляем в ленту
  useEffect(() => {
    const fresh = curator.replies.filter((reply) => !shown.current.has(reply.id))
    if (fresh.length === 0) return
    fresh.forEach((reply) => shown.current.add(reply.id))
    setMessages((list) => [...list, ...fresh.map((reply) => ({ id: nextId(), from: 'curator' as const, text: reply.text, synced: true, quiet: true }))])
    if (!open) setUnread(true)
  }, [curator.replies, open])

  // Куратор завершил диалог — дальше снова отвечает бот
  useEffect(() => {
    if (wasActive.current && !curator.active) {
      setMessages((list) => [
        ...list,
        { id: nextId(), from: 'bot', text: 'Куратор завершил диалог. Если появятся вопросы — пишите, я на связи.', synced: true, quiet: true },
      ])
    }
    wasActive.current = curator.active
  }, [curator.active])

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
    setDraft('')

    // Куратор на связи: бот молчит, сообщение уходит куратору
    if (curator.active) {
      setMessages((list) => [...list, { id: nextId(), from: 'user', text: question, synced: true }])
      onUserMessage?.(question)
      return
    }

    const userMessage: Message = { id: nextId(), from: 'user', text: question }
    setMessages((list) => [...list, userMessage])
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

    const botMessage: Message = { id: nextId(), from: 'bot', text: answer }
    setTyping(false)
    if (!handoff) {
      setMessages((list) => [...list, botMessage])
      return
    }
    // Куратору уходят реплики, которых он ещё не видел
    const all = [...messages, userMessage, botMessage]
    onHandoff?.(all.filter((message) => !message.synced && message.from !== 'curator').map(({ from, text }) => ({ from: from as HandoffMessage['from'], text })))
    setMessages((list) => [...list, botMessage].map((message) => ({ ...message, synced: true })))
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

  const rate = (id: string, feedback: 'up' | 'down') =>
    setMessages((list) => list.map((message) => (message.id === id ? { ...message, feedback } : message)))

  return (
    <>
      {!open && (
        <button
          ref={buttonRef}
          type="button"
          className={styles.button}
          aria-label={unread ? 'Открыть ИИ-помощника: новый ответ куратора' : 'Открыть ИИ-помощника'}
          onClick={() => {
            setOpen(true)
            setUnread(false)
          }}
        >
          <img src={botButton} alt="" width={80} height={83.5} />
          {unread && <span className={styles.unread} aria-hidden="true" />}
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
                <span aria-hidden="true">● </span>
                {curator.active ? 'на связи куратор' : 'в сети · отвечает сразу'}
              </p>
            </div>
            <button type="button" className={styles.close} onClick={close} aria-label="Закрыть">
              ✕
            </button>
          </header>

          <div ref={listRef} className={styles.messages} role="log" aria-live="polite">
            <p className={styles.day}>Сегодня</p>
            {messages.map((message) =>
              message.from === 'user' ? (
                <p key={message.id} className={`${styles.bubble} ${styles.user}`}>
                  {message.text}
                </p>
              ) : (
                <div key={message.id} className={`${styles.bubble} ${styles.bot}`}>
                  <span className={message.from === 'curator' ? `${styles.botName} ${styles.curatorName}` : styles.botName}>
                    {message.from === 'curator' ? 'Куратор' : 'ИИ-бот'}
                  </span>
                  <p>{message.text}</p>
                  {/* Приветствие и ответы куратора не оцениваем */}
                  {!message.quiet && (
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

          {/* Пока на связи куратор, быстрые вопросы боту не показываем */}
          {!curator.active && (
            <div className={styles.quick} aria-label="Частые вопросы">
              {topics.map((topic) => (
                <button key={topic.question} type="button" className={styles.chip} onClick={() => void ask(topic.question)} disabled={typing}>
                  {topic.question}
                </button>
              ))}
            </div>
          )}

          <form className={styles.composer} onSubmit={submit}>
            <textarea
              ref={inputRef}
              className={styles.input}
              rows={1}
              placeholder={curator.active ? 'Сообщение куратору…' : 'Задайте вопрос…'}
              aria-label={curator.active ? 'Сообщение куратору' : 'Вопрос'}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onKeyDown}
            />
            <button type="submit" className={styles.send} disabled={!draft.trim() || typing} aria-label="Отправить">
              <img src={sendIcon} alt="" width={20} height={20} />
            </button>
          </form>
          <p className={styles.note}>
            {curator.active
              ? 'Сейчас вам отвечает куратор. Когда он завершит диалог, снова подключится бот.'
              : 'Бот отвечает по базе знаний. Если он не знает ответа — подключится куратор.'}
          </p>
        </section>
      )}
    </>
  )
}
