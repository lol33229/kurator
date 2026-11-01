import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import chevronIcon from '@/assets/icons/chevron-down.svg'
import removeIcon from '@/assets/icons/xmark-small.svg'
import dropdownStyles from '@/shared/ui/Dropdown/Dropdown.module.css'
import type { DropdownOption } from '@/shared/ui/Dropdown/Dropdown'
import fieldStyles from '@/shared/ui/TextField/TextField.module.css'
import styles from './MultiSelect.module.css'

type MultiSelectProps = {
  label: string
  options: DropdownOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder: string
  required?: boolean
  error?: string
  className?: string
}

// Выбор нескольких вариантов: выбранное показывается метками в поле
export function MultiSelect({ label, options, value, onChange, placeholder, required, error, className }: MultiSelectProps) {
  const id = useId()
  const labelId = `${id}-label`
  const listId = `${id}-list`
  const errorId = `${id}-error`
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!open) return
    const onMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  const toggle = (optionValue: string) =>
    onChange(value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target !== triggerRef.current) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) return setOpen(true)
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + step + options.length) % options.length)
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (open) toggle(options[activeIndex].value)
      else setOpen(true)
    } else if (event.key === 'Escape' && open) {
      // Закрываем только список, а не всё окно
      event.stopPropagation()
      setOpen(false)
    } else if (event.key === 'Backspace' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const selected = options.filter((option) => value.includes(option.value))

  return (
    <div className={[fieldStyles.field, fieldStyles.compact, className].filter(Boolean).join(' ')}>
      <span id={labelId} className={fieldStyles.label} onClick={() => triggerRef.current?.focus()}>
        {label}
        {required && <span className={fieldStyles.required}> *</span>}
      </span>
      <div ref={rootRef} className={[dropdownStyles.root, open && dropdownStyles.open].filter(Boolean).join(' ')}>
        <div
          ref={triggerRef}
          role="combobox"
          tabIndex={0}
          aria-labelledby={labelId}
          aria-expanded={open}
          aria-controls={listId}
          aria-activedescendant={open ? `${id}-option-${activeIndex}` : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          className={[dropdownStyles.trigger, styles.trigger, error && dropdownStyles.invalid].filter(Boolean).join(' ')}
          onClick={(event) => event.target === event.currentTarget && setOpen(!open)}
          onKeyDown={onKeyDown}
        >
          {selected.length === 0 && (
            <span className={dropdownStyles.placeholder} onClick={() => setOpen(!open)}>
              {placeholder}
            </span>
          )}
          {selected.map((option) => (
            <span key={option.value} className={styles.chip}>
              {option.label}
              <button
                type="button"
                className={styles.remove}
                aria-label={`Убрать «${option.label}»`}
                onClick={() => toggle(option.value)}
              >
                <img src={removeIcon} alt="" width={11} height={11} />
              </button>
            </span>
          ))}
        </div>
        <img className={dropdownStyles.chevron} src={chevronIcon} alt="" width={16} height={16} />
        {open && (
          <ul id={listId} className={dropdownStyles.list} role="listbox" aria-multiselectable="true" aria-labelledby={labelId}>
            {options.map((option, index) => {
              const isPicked = value.includes(option.value)
              return (
                <li
                  key={option.value}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={isPicked}
                  className={[dropdownStyles.option, isPicked && styles.picked, index === activeIndex && dropdownStyles.active]
                    .filter(Boolean)
                    .join(' ')}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => toggle(option.value)}
                >
                  {option.label}
                </li>
              )
            })}
          </ul>
        )}
      </div>
      {error && (
        <p id={errorId} className={fieldStyles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
