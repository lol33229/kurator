import { useCallback, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link, useParams } from 'react-router'
import { Toast } from '@/shared/ui/Toast/Toast'
import { Avatar, Filters, PageTitle, Pill } from '../AdminParts'
import styles from './Bot.module.css'
import { CHAT_STATUSES, closeChat, sendReply, useChats, type BotChat } from './botStore'

const FILTERS = ['Все', ...CHAT_STATUSES] as const
type Filter = (typeof FILTERS)[number]

// Сначала те, кто ждёт оператора, потом в работе, потом завершённые
const ORDER = { 'Ждёт оператора': 0, 'В работе': 1, Завершён: 2 }

const AUTHORS = { user: '', bot: 'ИИ-бот', curator: 'Вы', system: '' }

// Последняя реплика для превью в списке
function preview(chat: BotChat) {
  const last = [...chat.messages].reverse().find((message) => message.from !== 'system')
  if (!last) return { text: '', time: '' }
  const prefix = last.from === 'curator' ? 'Вы: ' : last.from === 'bot' ? 'Бот: ' : ''
  return { text: prefix + last.text, time: chat.messages[chat.messages.length - 1].time }
}

// Переписка и поле ответа куратора
function Conversation({ chat, onClose }: { chat: BotChat; onClose: () => void }) {
  const [text, setText] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const closed = chat.status === 'Завершён'

  // Новые сообщения всегда видны внизу
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [chat.messages.length])

  const send = (event?: FormEvent) => {
    event?.preventDefault()
    if (!text.trim()) return
    sendReply(chat.id, text.trim())
    setText('')
  }

  // Enter отправляет, Shift+Enter — перенос строки
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) send(event)
  }

  return (
    <section className={styles.chat} aria-labelledby="chat-title">
      <header className={styles.chatHead}>
        <Link to="/admin/bot" className={styles.back}>
          ← Все диалоги
        </Link>
        <div className={styles.chatUser}>
          <Avatar initials={chat.initials} color={chat.color} />
          <div className={styles.chatUserText}>
            <h2 id="chat-title" className={styles.chatName}>
              {chat.name}
            </h2>
            <p className={styles.chatRole}>{chat.role}</p>
          </div>
          <Pill>{chat.status}</Pill>
        </div>
        <div className={styles.chatActions}>
          <Link to={`/admin/users/${chat.userId}`} className={styles.ghost}>
            Профиль
          </Link>
          {!closed && (
            <button type="button" className={styles.ghost} onClick={onClose}>
              Завершить диалог
            </button>
          )}
        </div>
      </header>

      <div ref={listRef} className={styles.messages} aria-live="polite">
        {chat.messages.map((message) =>
          message.from === 'system' ? (
            <p key={message.id} className={styles.system}>
              {message.text} · {message.time}
            </p>
          ) : (
            <div key={message.id} className={`${styles.message} ${styles[message.from]}`}>
              {AUTHORS[message.from] && <p className={styles.author}>{AUTHORS[message.from]}</p>}
              <p className={styles.text}>{message.text}</p>
              <p className={styles.time}>{message.time}</p>
            </div>
          ),
        )}
      </div>

      {closed ? (
        <p className={styles.closedNote}>Диалог завершён. Если пользователь снова попросит оператора, диалог вернётся сюда.</p>
      ) : (
        <form className={styles.composer} onSubmit={send}>
          <label className={styles.hiddenLabel} htmlFor="bot-reply">
            Ответ пользователю
          </label>
          <textarea
            id="bot-reply"
            className={styles.input}
            rows={1}
            value={text}
            placeholder="Ответ от имени куратора"
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
          />
          <button type="submit" className={styles.send} disabled={!text.trim()}>
            Отправить
          </button>
        </form>
      )}
    </section>
  )
}

// Диалоги ИИ-бота, где пользователь ждёт живого ответа куратора
export function BotPage() {
  const { id } = useParams()
  const chats = useChats()
  const [filter, setFilter] = useState<Filter>('Все')
  const [toast, setToast] = useState<string | null>(null)
  const hideToast = useCallback(() => setToast(null), [setToast])

  const visible = chats
    .filter((chat) => filter === 'Все' || chat.status === filter)
    .sort((a, b) => ORDER[a.status] - ORDER[b.status])
  const current = chats.find((chat) => chat.id === id)

  return (
    <>
      <PageTitle title="ИИ-бот" subtitle="Диалоги, в которых пользователи ждут ответа куратора" />
      <Filters label="Статус диалога" options={FILTERS} value={filter} onChange={setFilter} className={styles.filters} />

      <div className={`${styles.panel} ${current ? styles.hasChat : ''}`}>
        <nav className={styles.list} aria-label="Диалоги">
          {visible.length === 0 && <p className={styles.empty}>Диалогов нет</p>}
          {visible.map((chat) => {
            const last = preview(chat)
            return (
              <Link
                key={chat.id}
                to={`/admin/bot/${chat.id}`}
                className={[styles.item, chat.id === id && styles.itemActive].filter(Boolean).join(' ')}
                aria-current={chat.id === id ? 'page' : undefined}
              >
                <Avatar initials={chat.initials} color={chat.color} />
                <div className={styles.itemBody}>
                  <div className={styles.itemTop}>
                    <span className={styles.itemName}>{chat.name}</span>
                    <span className={styles.itemTime}>{last.time}</span>
                  </div>
                  <p className={styles.itemText}>{last.text}</p>
                  <div className={styles.itemBottom}>
                    <span className={styles.itemRole}>{chat.role}</span>
                    <Pill>{chat.status}</Pill>
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>

        {current ? (
          <Conversation
            key={current.id}
            chat={current}
            onClose={() => {
              closeChat(current.id)
              setToast('Диалог завершён')
            }}
          />
        ) : (
          <div className={styles.placeholder}>
            <p className={styles.placeholderTitle}>Выберите диалог</p>
            <p>Диалоги, где бот передал вопрос куратору, появляются в списке слева</p>
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
