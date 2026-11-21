import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router'
import attachIcon from '@/assets/messages/attach.svg'
import meetingIcon from '@/assets/messages/meeting.svg'
import sendIcon from '@/assets/messages/send.svg'
import trashIcon from '@/assets/messages/trash.svg'
import type { Chat, ChatFile, ChatMessage } from './messagesData'
import styles from './Messages.module.css'

export function ChatAvatar({ chat }: { chat: Chat }) {
  return (
    <span className={styles.avatar} style={{ background: chat.color }} aria-hidden="true">
      {chat.initials}
      {chat.online && <span className={styles.online} />}
    </span>
  )
}

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} КБ` : `${(bytes / 1024 / 1024).toFixed(1)} МБ`
}

function Bubble({ message }: { message: Extract<ChatMessage, { kind: 'text' }> }) {
  const mine = message.from === 'me'
  return (
    <div className={`${styles.bubble} ${mine ? styles.mine : styles.theirs}`}>
      {message.file && <FileCard file={message.file} />}
      {message.text && <p className={styles.bubbleText}>{message.text}</p>}
      <span className={styles.bubbleTime}>
        {message.time}
        {mine && (
          <span aria-label="прочитано">
            {' '}
            ✓✓
          </span>
        )}
      </span>
    </div>
  )
}

function FileCard({ file }: { file: ChatFile }) {
  return (
    <div className={styles.file}>
      <span className={styles.fileType}>{file.type}</span>
      <span>
        <span className={styles.fileName}>{file.name}</span>
        <span className={styles.fileSize}>{file.size}</span>
      </span>
    </div>
  )
}

type ChatViewProps = {
  chat: Chat
  onSend: (text: string, file?: ChatFile) => void
  onDelete: () => void
  onSchedule: () => void
  onComplain: () => void
  onBack: () => void
}

// Открытая переписка
export function ChatView({ chat, onSend, onDelete, onSchedule, onComplain, onBack }: ChatViewProps) {
  const [draft, setDraft] = useState('')
  const listRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const canSend = draft.trim().length > 0

  // Новые сообщения внизу: держим ленту прокрученной до конца
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [chat.id, chat.messages.length])

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    if (!canSend) return
    onSend(draft.trim())
    setDraft('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const type = (file.name.split('.').pop() ?? 'FILE').slice(0, 4).toUpperCase()
      onSend(draft.trim(), { name: file.name, size: formatSize(file.size), type })
      setDraft('')
    }
    event.target.value = ''
  }

  return (
    <section className={styles.chat} aria-label={`Чат: ${chat.name}`}>
      <header className={styles.chatHead}>
        <button type="button" className={styles.back} onClick={onBack}>
          ← Чаты
        </button>
        <div className={styles.person}>
          <ChatAvatar chat={chat} />
          <div className={styles.personText}>
            <h2 className={styles.personName}>{chat.name}</h2>
            <p className={styles.personAbout}>
              {chat.online ? 'в сети · ' : ''}
              {chat.about}
            </p>
          </div>
        </div>
        <div className={styles.headActions}>
          <button type="button" className={`${styles.headButton} ${styles.primary}`} onClick={onSchedule}>
            Назначить встречу
          </button>
          <button type="button" className={`${styles.headButton} ${styles.secondary}`} onClick={onComplain}>
            Пожаловаться
          </button>
          <button type="button" className={styles.delete} onClick={onDelete} aria-label="Удалить чат">
            <img src={trashIcon} alt="" width={17} height={17} />
          </button>
        </div>
      </header>

      {chat.goal && (
        <div className={styles.goal}>
          <p className={styles.goalText}>
            Цель: <b>{chat.goal.title}</b>
          </p>
          <span
            className={styles.goalTrack}
            role="progressbar"
            aria-label="Прогресс по цели"
            aria-valuenow={chat.goal.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <span style={{ width: `${chat.goal.progress}%` }} />
          </span>
          <b className={styles.goalValue}>{chat.goal.progress}%</b>
          <Link to="/student/goals" className={styles.goalLink}>
            Общий экран →
          </Link>
        </div>
      )}

      <div ref={listRef} className={styles.messages} role="log" aria-live="polite">
        {chat.messages.map((message, index) => {
          // Плашка дня перед первым сообщением этого дня
          const showDay = message.day !== chat.messages[index - 1]?.day
          return (
            <div key={message.id} className={styles.messageRow}>
              {showDay && <p className={styles.day}>{message.day}</p>}
              {message.kind === 'event' ? (
                <p className={styles.event}>
                  <img src={meetingIcon} alt="" width={38} height={38} />
                  {message.text}
                </p>
              ) : (
                <Bubble message={message} />
              )}
            </div>
          )
        })}
      </div>

      <form className={styles.composer} onSubmit={submit}>
        <button type="button" className={styles.attach} onClick={() => fileRef.current?.click()} aria-label="Прикрепить файл">
          <img src={attachIcon} alt="" width={16} height={17} />
        </button>
        <input ref={fileRef} type="file" hidden onChange={onFile} />
        <textarea
          className={styles.input}
          rows={1}
          placeholder="Напишите сообщение…"
          aria-label="Сообщение"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
        />
        <button type="submit" className={styles.send} disabled={!canSend} aria-label="Отправить">
          <img src={sendIcon} alt="" width={20} height={20} />
        </button>
      </form>
    </section>
  )
}
