import { useId, type TextareaHTMLAttributes } from 'react'
import styles from './TextField.module.css'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string
  error?: string
}

// Многострочное поле в компактном размере анкеты
export function TextArea({ label, error, required, className, ...textareaProps }: TextAreaProps) {
  const id = useId()
  const errorId = `${id}-error`

  return (
    <div className={[styles.field, styles.compact, className].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </label>
      <textarea
        id={id}
        className={[styles.input, styles.textarea, error && styles.invalid].filter(Boolean).join(' ')}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        {...textareaProps}
      />
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
