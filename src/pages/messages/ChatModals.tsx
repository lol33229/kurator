import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import styles from './ChatModals.module.css'

type Option<T> = { value: T; label: string }

function Segments<T extends string>({ label, options, value, onChange }: { label: string; options: Option<T>[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className={styles.segments} role="radiogroup" aria-label={label} style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          className={[styles.segment, option.value === value && styles.segmentActive].filter(Boolean).join(' ')}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

type DialogProps = {
  title: string
  subtitle: string
  submitLabel: string
  canSubmit: boolean
  onSubmit: () => void
  onClose: () => void
  children: ReactNode
}

// Общий каркас окон чата: заголовок, поля, «Отмена» и главная кнопка
function ChatDialog({ title, subtitle, submitLabel, canSubmit, onSubmit, onClose, children }: DialogProps) {
  const titleId = useId()
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (canSubmit) onSubmit()
  }
  return (
    <Modal labelledBy={titleId} onClose={onClose} className={styles.dialog}>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p className={styles.subtitle}>{subtitle}</p>
      <form className={styles.form} onSubmit={submit} noValidate>
        {children}
        <div className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className={styles.submit} disabled={!canSubmit}>
            {submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}

// ---------- Назначить встречу ----------

export type Meeting = { topic: string; date: string; time: string; duration: string; format: string }

const DURATIONS: Option<string>[] = [
  { value: '30 мин', label: '30 мин' },
  { value: '1 час', label: '1 час' },
  { value: '1,5 часа', label: '1,5 часа' },
]

const FORMATS: Option<string>[] = [
  { value: 'Онлайн', label: 'Онлайн' },
  { value: 'Очно', label: 'Очно' },
]

// Завтрашняя дата в формате поля date
function tomorrow() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function MeetingModal({ recipient, onSubmit, onClose }: { recipient: string; onSubmit: (meeting: Meeting) => void; onClose: () => void }) {
  const id = useId()
  const [topic, setTopic] = useState('')
  const [date, setDate] = useState(tomorrow)
  const [time, setTime] = useState('17:00')
  const [duration, setDuration] = useState('1 час')
  const [format, setFormat] = useState('Онлайн')
  const canSubmit = topic.trim() !== '' && date !== '' && time !== ''

  return (
    <ChatDialog
      title="Назначить встречу"
      subtitle={`Приглашение получит ${recipient}`}
      submitLabel="Отправить приглашение"
      canSubmit={canSubmit}
      onSubmit={() => onSubmit({ topic: topic.trim(), date, time, duration, format })}
      onClose={onClose}
    >
      <label className={styles.label} htmlFor={`${id}-topic`}>
        Тема
      </label>
      <input
        id={`${id}-topic`}
        className={styles.input}
        placeholder="Например, разбор резюме"
        value={topic}
        onChange={(event) => setTopic(event.target.value)}
      />
      <div className={styles.row}>
        <div>
          <label className={styles.label} htmlFor={`${id}-date`}>
            Дата
          </label>
          <input id={`${id}-date`} className={`${styles.input} ${styles.tall}`} type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div>
          <label className={styles.label} htmlFor={`${id}-time`}>
            Время
          </label>
          <input id={`${id}-time`} className={`${styles.input} ${styles.tall}`} type="time" value={time} onChange={(event) => setTime(event.target.value)} />
        </div>
      </div>
      <p className={styles.label}>Длительность</p>
      <Segments label="Длительность" options={DURATIONS} value={duration} onChange={setDuration} />
      <p className={styles.label}>Формат</p>
      <Segments label="Формат" options={FORMATS} value={format} onChange={setFormat} />
    </ChatDialog>
  )
}

// ---------- Пожаловаться ----------

const REASONS = [
  'Спам или реклама',
  'Оскорбления или некорректное поведение',
  'Мошенничество',
  'Не выходит на связь / пропускает встречи',
  'Другое',
]

export function ComplaintModal({ onSubmit, onClose }: { onSubmit: () => void; onClose: () => void }) {
  const id = useId()
  const [reason, setReason] = useState('')
  const [comment, setComment] = useState('')

  return (
    <ChatDialog
      title="Пожаловаться"
      subtitle="Жалоба анонимна — собеседник не узнает, кто её отправил."
      submitLabel="Отправить жалобу"
      canSubmit={reason !== ''}
      onSubmit={onSubmit}
      onClose={onClose}
    >
      <fieldset className={styles.reasons}>
        <legend className={styles.hidden}>Причина жалобы</legend>
        {REASONS.map((item) => (
          <label key={item} className={[styles.reason, item === reason && styles.reasonActive].filter(Boolean).join(' ')}>
            <input type="radio" name={`${id}-reason`} value={item} checked={item === reason} onChange={() => setReason(item)} />
            <span className={styles.radio} aria-hidden="true" />
            {item}
          </label>
        ))}
      </fieldset>
      <label className={`${styles.label} ${styles.commentLabel}`} htmlFor={`${id}-comment`}>
        Комментарий
      </label>
      <textarea
        id={`${id}-comment`}
        className={`${styles.input} ${styles.comment}`}
        placeholder="Опишите ситуацию (необязательно)"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
      />
    </ChatDialog>
  )
}
