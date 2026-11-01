import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import chevronIcon from '@/assets/icons/chevron-down.svg'
import removeIcon from '@/assets/icons/xmark-small.svg'
import chipStyles from '@/shared/ui/MultiSelect/MultiSelect.module.css'
import fieldStyles from '@/shared/ui/TextField/TextField.module.css'
import styles from './Dropdown.module.css'

export type DropdownOption = {
  value: string
  label: string
}

type DropdownProps = {
  label: string
  options: DropdownOption[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
  error?: string
  // Поле ввода с подсказками: значение — введённый текст
  searchable?: boolean
  // Выбранное значение показывается меткой с крестиком
  chip?: boolean
  className?: string
}

export function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
  required,
  error,
  searchable,
  chip,
  className,
}: DropdownProps) {
  const id = useId()
  const listId = `${id}-list`
  const errorId = `${id}-error`
  const rootRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const query = searchable ? value.trim().toLowerCase() : ''
  const visibleOptions = query ? options.filter((option) => option.label.toLowerCase().includes(query)) : options
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return
    const onMouseDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  const openList = () => {
    setOpen(true)
    setActiveIndex(Math.max(0, visibleOptions.indexOf(selected as DropdownOption)))
  }

  const choose = (option: DropdownOption) => {
    onChange(searchable ? option.label : option.value)
    setOpen(false)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) return openList()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => (index + step + visibleOptions.length) % visibleOptions.length)
    } else if (event.key === 'Enter' && open && visibleOptions[activeIndex]) {
      event.preventDefault()
      choose(visibleOptions[activeIndex])
    } else if (event.key === 'Escape' && open) {
      // Закрываем только список, а не всё окно
      event.stopPropagation()
      setOpen(false)
    } else if (chip && value && (event.key === 'Backspace' || event.key === 'Delete')) {
      onChange('')
    } else if (!searchable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      openList()
    }
  }

  const comboboxProps = {
    id,
    role: 'combobox',
    'aria-expanded': open,
    'aria-controls': listId,
    'aria-activedescendant': open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? errorId : undefined,
    'aria-required': required,
    className: [styles.trigger, chip && styles.chipTrigger, error && styles.invalid].filter(Boolean).join(' '),
    onKeyDown,
  }

  return (
    <div className={[fieldStyles.field, fieldStyles.compact, className].filter(Boolean).join(' ')}>
      <label className={fieldStyles.label} htmlFor={id}>
        {label}
        {required && <span className={fieldStyles.required}> *</span>}
      </label>
      <div ref={rootRef} className={[styles.root, open && styles.open].filter(Boolean).join(' ')}>
        {searchable ? (
          <input
            {...comboboxProps}
            aria-autocomplete="list"
            autoComplete="off"
            placeholder={placeholder}
            value={value}
            onChange={(event) => {
              onChange(event.target.value)
              setOpen(true)
              setActiveIndex(0)
            }}
            onClick={openList}
          />
        ) : (
          <button {...comboboxProps} type="button" aria-haspopup="listbox" onClick={() => (open ? setOpen(false) : openList())}>
            {chip && selected ? (
              <span className={chipStyles.chip}>
                {selected.label}
                {/* Внутри кнопки нельзя вложить кнопку, с клавиатуры очищается Backspace */}
                <span
                  className={chipStyles.remove}
                  aria-hidden="true"
                  onClick={(event) => {
                    event.stopPropagation()
                    onChange('')
                  }}
                >
                  <img src={removeIcon} alt="" width={11} height={11} />
                </span>
              </span>
            ) : (
              <span className={[styles.value, !selected && styles.placeholder].filter(Boolean).join(' ')}>
                {selected ? selected.label : placeholder}
              </span>
            )}
          </button>
        )}
        <img className={styles.chevron} src={chevronIcon} alt="" width={16} height={16} />
        {open && visibleOptions.length > 0 && (
          <ul id={listId} className={styles.list} role="listbox" aria-label={label}>
            {visibleOptions.map((option, index) => (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={option.value === value || option.label === value}
                className={[
                  styles.option,
                  index === activeIndex && styles.active,
                  (option.value === value || option.label === value) && styles.selected,
                ]
                  .filter(Boolean)
                  .join(' ')}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => choose(option)}
              >
                {option.label}
              </li>
            ))}
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
