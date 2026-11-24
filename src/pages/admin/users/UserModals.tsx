import { useId, useState, type FormEvent } from 'react'
import { Modal } from '@/shared/ui/Modal/Modal'
import { WARNING_REASONS, WARNINGS_LIMIT } from '../adminData'
import styles from './UserModals.module.css'

type ConfirmProps = {
  title: string
  text: string
  action: string
  onConfirm: () => void
  onClose: () => void
}

// Окно подтверждения с красной кнопкой
function ConfirmModal({ title, text, action, onConfirm, onClose }: ConfirmProps) {
  const titleId = useId()
  return (
    <Modal labelledBy={titleId} onClose={onClose} className={styles.dialog}>
      <h2 id={titleId} className={styles.title}>
        {title}
      </h2>
      <p className={styles.text}>{text}</p>
      <div className={styles.footer}>
        <button type="button" className={styles.cancel} onClick={onClose}>
          Отмена
        </button>
        <button type="button" className={styles.danger} onClick={onConfirm}>
          {action}
        </button>
      </div>
    </Modal>
  )
}

type UserModalProps = { name: string; onConfirm: () => void; onClose: () => void }

export function BlockUserModal({ name, ...props }: UserModalProps) {
  return (
    <ConfirmModal
      title="Заблокировать пользователя?"
      text={`${name} не сможет входить на платформу, а его активные пары будут приостановлены. Действие можно отменить.`}
      action="Заблокировать"
      {...props}
    />
  )
}

export function DeleteUserModal({ name, ...props }: UserModalProps) {
  return (
    <ConfirmModal
      title="Удалить пользователя?"
      text={`Аккаунт ${name}, его пары и переписка будут удалены без возможности восстановления.`}
      action="Удалить"
      {...props}
    />
  )
}

type WarningProps = {
  name: string
  warnings: number
  onSend: (reason: string, comment: string) => void
  onClose: () => void
}

// Предупреждение с причиной и комментарием
export function WarningModal({ name, warnings, onSend, onClose }: WarningProps) {
  const titleId = useId()
  const [reason, setReason] = useState(WARNING_REASONS[0])
  const [comment, setComment] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSend(reason, comment.trim())
  }

  return (
    <Modal labelledBy={titleId} onClose={onClose} className={styles.dialog}>
      <form onSubmit={submit}>
        <h2 id={titleId} className={styles.title}>
          Предупреждение
        </h2>
        <p className={styles.text}>
          {name} получит уведомление. Сейчас предупреждений: {warnings}. После {WARNINGS_LIMIT} аккаунт блокируется автоматически.
        </p>

        <label className={styles.label} htmlFor={`${titleId}-reason`}>
          Причина
        </label>
        <select id={`${titleId}-reason`} className={styles.field} value={reason} onChange={(event) => setReason(event.target.value)}>
          {WARNING_REASONS.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>

        <label className={styles.label} htmlFor={`${titleId}-comment`}>
          Комментарий
        </label>
        <textarea
          id={`${titleId}-comment`}
          className={`${styles.field} ${styles.textarea}`}
          value={comment}
          placeholder="Что именно нарушено"
          onChange={(event) => setComment(event.target.value)}
        />

        <div className={`${styles.footer} ${styles.formFooter}`}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Отмена
          </button>
          <button type="submit" className={styles.primary}>
            Отправить
          </button>
        </div>
      </form>
    </Modal>
  )
}
