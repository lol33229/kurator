import { useId, type FormEvent, type ReactNode } from 'react'
import cardStyles from '@/shared/ui/DashboardCard/DashboardCard.module.css'
import { LEVELS } from './editOptions'
import type { SkillLevel } from './ProfileParts'
import styles from './ProfileEdit.module.css'

// Общие части режима редактирования секций профиля

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(' ')

// ---------- Карточка ----------

type EditCardProps = {
  title: string
  subtitle: string
  onCancel: () => void
  onSave: () => void
  className?: string
  children: ReactNode
}

// Секция в режиме редактирования: зелёная рамка, плашка и кнопки внизу
export function EditCard({ title, subtitle, onCancel, onSave, className, children }: EditCardProps) {
  const titleId = useId()
  const submit = (event: FormEvent) => {
    event.preventDefault()
    onSave()
  }
  return (
    <section className={cx(cardStyles.card, styles.card, className)} aria-labelledby={titleId}>
      <div className={styles.head}>
        <div>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        <span className={styles.badge}>✎ Редактирование</span>
      </div>
      <form className={styles.form} onSubmit={submit} noValidate>
        {children}
        <div className={styles.footer}>
          <p className={styles.requiredNote}>
            <span className={styles.star}>*</span> — обязательные поля
          </p>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className={styles.save}>
            Сохранить
          </button>
        </div>
      </form>
    </section>
  )
}

// ---------- Поля ----------

type FieldProps = {
  label: string
  required?: boolean
  optional?: boolean
  error?: string
  className?: string
  children: (id: string, describedBy?: string) => ReactNode
}

// Подпись, поле и ошибка под ним
export function Field({ label, required, optional, error, className, children }: FieldProps) {
  const id = useId()
  return (
    <div className={cx(styles.field, className)}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.star}> *</span>}
        {optional && <span className={styles.optional}> — необязательно</span>}
      </label>
      {children(id, error ? `${id}-error` : undefined)}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

type InputProps = {
  id?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  invalid?: boolean
  describedBy?: string
  disabled?: boolean
  label?: string
  inputMode?: 'numeric' | 'text'
  maxLength?: number
}

export function TextInput({ id, value, onChange, placeholder, type = 'text', invalid, describedBy, disabled, label, inputMode, maxLength }: InputProps) {
  return (
    <input
      id={id}
      className={cx(styles.input, invalid && styles.invalid)}
      type={type}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      inputMode={inputMode}
      maxLength={maxLength}
      aria-label={label}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

type SelectProps = {
  id?: string
  value: string
  options: string[]
  onChange: (value: string) => void
  label?: string
}

export function Select({ id, value, options, onChange, label }: SelectProps) {
  return (
    <select id={id} className={styles.select} value={value} aria-label={label} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  )
}

type ChipsProps = {
  label: string
  options: string[]
  value: string[]
  onChange: (value: string[]) => void
  invalid?: boolean
}

// Кнопки-переключатели: выбрано несколько значений
export function ToggleChips({ label, options, value, onChange, invalid }: ChipsProps) {
  const toggle = (option: string) =>
    onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])
  return (
    <div className={cx(styles.chips, invalid && styles.chipsInvalid)} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value.includes(option)}
          className={cx(styles.chip, value.includes(option) && styles.chipOn)}
          onClick={() => toggle(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

export function RemoveButton({ label, onClick, className }: { label: string; onClick: () => void; className?: string }) {
  return (
    <button type="button" className={cx(styles.remove, className)} aria-label={label} onClick={onClick}>
      ✕
    </button>
  )
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className={styles.add} onClick={onClick}>
      ＋ {label}
    </button>
  )
}

export function SectionLabel({ children, note }: { children: ReactNode; note?: string }) {
  return (
    <p className={styles.sectionLabel}>
      {children}
      {note && <span className={styles.optional}> — {note}</span>}
    </p>
  )
}

export function ErrorText({ children }: { children?: string }) {
  return children ? <p className={styles.error}>{children}</p> : null
}

// ---------- Навыки с уровнем ----------

type SkillRowsProps = {
  rows: SkillLevel[]
  onChange: (rows: SkillLevel[]) => void
  popular?: string[]
  error?: string
}

// Строки «навык — уровень» с удалением и добавлением
export function SkillRows({ rows, onChange, popular = [], error }: SkillRowsProps) {
  const update = (index: number, patch: Partial<SkillLevel>) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  const add = (skill = '') => onChange([...rows, { skill, level: LEVELS[0] }])
  const names = rows.map((row) => row.skill.trim().toLowerCase())
  const suggestions = popular.filter((skill) => !names.includes(skill.toLowerCase()))

  return (
    <div>
      <ul className={styles.skillRows}>
        {rows.map((row, index) => (
          <li key={index} className={styles.skillRow}>
            <TextInput
              value={row.skill}
              placeholder="Навык, например Python"
              label={`Навык ${index + 1}`}
              invalid={Boolean(error) && !row.skill.trim()}
              onChange={(skill) => update(index, { skill })}
            />
            <Select value={row.level} options={LEVELS} label={`Уровень навыка ${row.skill || index + 1}`} onChange={(level) => update(index, { level })} />
            <RemoveButton label={`Удалить навык ${row.skill}`.trim()} onClick={() => onChange(rows.filter((_, i) => i !== index))} />
          </li>
        ))}
      </ul>
      <ErrorText>{error}</ErrorText>
      <AddButton label="Добавить навык" onClick={() => add()} />
      {suggestions.length > 0 && (
        <div className={styles.popular}>
          <span>Популярные:</span>
          {suggestions.map((skill) => (
            <button key={skill} type="button" className={styles.popularChip} onClick={() => add(skill)}>
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
