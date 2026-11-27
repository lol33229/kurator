import { useId, useState, type FormEvent } from 'react'
import { addReview, type PlatformReview } from '@/pages/admin/reviews/reviewsStore'
import chat from '@/pages/messages/ChatModals.module.css'
import { moderateReview, REASON_TEXT, type ModerationReason } from '@/shared/api/moderation'
import { Modal } from '@/shared/ui/Modal/Modal'
import styles from './ReviewModal.module.css'


// Короче этого отзыв не отправляем: модерации и менти нечего прочитать
const MIN_LENGTH = 10

const reasonsText = (reasons: ModerationReason[]) => reasons.map((reason) => REASON_TEXT[reason]).join(', ')

// Ряд звёзд от 1 до 5
function Stars({ label, value, onChange, large }: { label: string; value: number; onChange: (value: number) => void; large?: boolean }) {
  return (
    <div className={`${styles.stars} ${large ? styles.large : ''}`} role="radiogroup" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} из 5`}
          className={star <= value ? styles.starOn : styles.star}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  )
}

type ReviewModalProps = {
  title: string
  author: PlatformReview['author']
  target: PlatformReview['target']
  criteria: string[]
  // Итог для уведомления на странице
  onDone: (message: string) => void
  onClose: () => void
}

// Отзыв об участнике пары: общая оценка, критерии и текст. Текст проверяет ИИ-модерация
export function ReviewModal({ title, author, target, criteria: criteriaList, onDone, onClose }: ReviewModalProps) {
  const titleId = useId()
  const [rating, setRating] = useState(0)
  const [criteria, setCriteria] = useState<Record<string, number>>({})
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [rejected, setRejected] = useState<ModerationReason[] | null>(null)

  const ready = rating > 0 && text.trim().length >= MIN_LENGTH && !sending

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    setSending(true)
    setRejected(null)
    try {
      const result = await moderateReview(crypto.randomUUID(), text.trim(), rating)
      if (result.verdict === 'reject') {
        setRejected(result.reasons)
        setSending(false)
        return
      }
      const status = result.verdict === 'publish' ? 'Опубликован' : 'На проверке'
      addReview({ author, target, rating, text: text.trim(), status, reasons: result.reasons })
      onDone(
        result.verdict === 'publish'
          ? 'Отзыв опубликован'
          : `Отзыв отправлен на проверку куратору${result.reasons.length ? `: ${reasonsText(result.reasons)}` : ''}`,
      )
    } catch {
      // Сервис недоступен — отзыв ждёт проверки куратора
      addReview({ author, target, rating, text: text.trim(), status: 'На проверке', reasons: [] })
      onDone('Отзыв отправлен на проверку куратору')
    }
  }

  return (
    <Modal labelledBy={titleId} onClose={onClose} className={chat.dialog}>
      <h2 id={titleId} className={chat.title}>
        {title}
      </h2>
      <p className={chat.subtitle}>{target.name.split(' ')[0]} увидит отзыв в своём профиле после модерации</p>

      <form className={chat.form} onSubmit={submit} noValidate>
        <p className={chat.label}>Общая оценка</p>
        <Stars label="Общая оценка" value={rating} onChange={setRating} large />

        <ul className={styles.criteria}>
          {criteriaList.map((criterion) => (
            <li key={criterion} className={styles.criterion}>
              <span>{criterion}</span>
              <Stars
                label={criterion}
                value={criteria[criterion] ?? 0}
                onChange={(value) => setCriteria((current) => ({ ...current, [criterion]: value }))}
              />
            </li>
          ))}
        </ul>

        <label className={chat.label} htmlFor={`${titleId}-text`}>
          Отзыв
        </label>
        <textarea
          id={`${titleId}-text`}
          className={`${chat.input} ${styles.text}`}
          value={text}
          placeholder="Что получилось, над чем стоит поработать"
          maxLength={2000}
          onChange={(event) => {
            setText(event.target.value)
            setRejected(null)
          }}
        />
        <p className={styles.hint}>Отзывы проверяет ИИ: без оскорблений, рекламы и контактов.</p>

        {rejected && (
          <p className={styles.error} role="alert">
            Отзыв не прошёл модерацию{rejected.length ? `: ${reasonsText(rejected)}` : ''}. Исправьте текст и отправьте снова.
          </p>
        )}

        <div className={chat.footer}>
          <button type="button" className={chat.cancel} onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className={chat.submit} disabled={!ready}>
            {sending ? 'Проверяем…' : 'Отправить'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
