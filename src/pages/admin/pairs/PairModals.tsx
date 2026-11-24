import { useId, useState, type FormEvent } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { Avatar } from '../AdminParts'
import m from '../users/UserModals.module.css'
import styles from './PairModals.module.css'

type ContactProps = {
  person: { name: string; initials: string; color: string }
  role: string
  onSend: (text: string) => void
  onClose: () => void
}

// Сообщение участнику пары от куратора
export function ContactModal({ person, role, onSend, onClose }: ContactProps) {
  const titleId = useId()
  const [text, setText] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (text.trim()) onSend(text.trim())
  }

  return (
    <Modal labelledBy={titleId} onClose={onClose} className={m.dialog}>
      <form onSubmit={submit}>
        <h2 id={titleId} className={m.title}>
          Связаться
        </h2>
        <div className={styles.person}>
          <Avatar initials={person.initials} color={person.color} />
          <div>
            <p className={styles.name}>{person.name}</p>
            <p className={styles.role}>{role}</p>
          </div>
        </div>
        <label className={`${m.label} ${styles.label}`} htmlFor={`${titleId}-text`}>
          Сообщение
        </label>
        <textarea
          id={`${titleId}-text`}
          className={`${m.field} ${m.textarea} ${styles.textarea}`}
          value={text}
          placeholder="Сообщение от куратора"
          onChange={(event) => setText(event.target.value)}
        />
        <div className={`${m.footer} ${m.formFooter}`}>
          <button type="button" className={m.cancel} onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className={m.primary} disabled={!text.trim()}>
            Отправить в чат
          </button>
        </div>
      </form>
    </Modal>
  )
}

// Подтверждение повторного подбора
export function RematchModal({ onConfirm, onClose }: { onConfirm: () => void; onClose: () => void }) {
  const titleId = useId()
  return (
    <Modal labelledBy={titleId} onClose={onClose} className={m.dialog}>
      <h2 id={titleId} className={m.title}>
        Инициировать повторный подбор?
      </h2>
      <p className={`${m.text} ${styles.text}`}>
        Текущая пара будет приостановлена, а ИИ подберёт менти новых наставников. Оба участника получат уведомление.
      </p>
      <div className={m.footer}>
        <button type="button" className={m.cancel} onClick={onClose}>
          Отмена
        </button>
        <button type="button" className={m.primary} onClick={onConfirm}>
          Запустить подбор
        </button>
      </div>
    </Modal>
  )
}
