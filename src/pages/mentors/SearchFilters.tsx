import type { CSSProperties, ReactNode } from 'react'
import { DIRECTION_FILTERS, FORMAT_FILTERS, MAX_PRICE, SKILL_FILTERS, formatMoney } from './data'
import type { Filters } from './filters'
import styles from './SearchFilters.module.css'

const HOURS_OPTIONS = [
  { value: 0, label: 'Любая' },
  { value: 2, label: '2+' },
  { value: 4, label: '4+' },
  { value: 6, label: '6+' },
]

const DURATION_OPTIONS = [
  { value: 0, label: '—', ariaLabel: 'Любая' },
  { value: 1, label: '1 мес' },
  { value: 3, label: '3 мес' },
  { value: 6, label: '6 мес' },
]

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((item) => item !== value) : [...list, value])

type SearchFiltersProps = {
  filters: Filters
  onChange: (filters: Filters) => void
  onReset: () => void
  open: boolean
  onToggle: () => void
}

// Фильтры подбора ментора
export function SearchFilters({ filters, onChange, onReset, open, onToggle }: SearchFiltersProps) {
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value })

  return (
    <aside className={styles.filters} aria-label="Фильтры">
      <div className={styles.head}>
        <h2 className={styles.title}>Фильтры</h2>
        <button type="button" className={styles.reset} onClick={onReset}>
          Сбросить
        </button>
        <button type="button" className={styles.toggle} aria-expanded={open} onClick={onToggle}>
          {open ? 'Скрыть' : 'Показать'}
        </button>
      </div>

      <div className={[styles.body, open && styles.bodyOpen].filter(Boolean).join(' ')}>
        <fieldset className={styles.skillsGroup}>
          <legend className={styles.label}>Компетенции</legend>
          <div className={styles.chips}>
            {SKILL_FILTERS.map((skill) => {
              const active = filters.skills.includes(skill)
              return (
                <button
                  key={skill}
                  type="button"
                  className={[styles.chip, active && styles.chipActive].filter(Boolean).join(' ')}
                  aria-pressed={active}
                  onClick={() => set('skills', toggle(filters.skills, skill))}
                >
                  {skill}
                </button>
              )
            })}
          </div>
        </fieldset>

        <Section title="Опыт работы" note="лет">
          <div className={styles.range}>
            <input
              className={styles.input}
              type="number"
              min={0}
              max={50}
              inputMode="numeric"
              placeholder="от 0"
              aria-label="Опыт от, лет"
              value={filters.experienceFrom}
              onChange={(event) => set('experienceFrom', event.target.value)}
            />
            <span aria-hidden="true">—</span>
            <input
              className={styles.input}
              type="number"
              min={0}
              max={50}
              inputMode="numeric"
              placeholder="до 20"
              aria-label="Опыт до, лет"
              value={filters.experienceTo}
              onChange={(event) => set('experienceTo', event.target.value)}
            />
          </div>
        </Section>

        <Section title="Профессиональное направление">
          {DIRECTION_FILTERS.map((direction) => (
            <Checkbox
              key={direction}
              label={direction}
              checked={filters.directions.includes(direction)}
              onChange={() => set('directions', toggle(filters.directions, direction))}
            />
          ))}
        </Section>

        <Section title="Формат взаимодействия">
          {FORMAT_FILTERS.map((format) => (
            <Checkbox
              key={format.value}
              label={format.label}
              checked={filters.formats.includes(format.value)}
              onChange={() => set('formats', toggle(filters.formats, format.value))}
            />
          ))}
        </Section>

        <Section title="Доступность" note="часов в неделю">
          <Segments label="Доступность" options={HOURS_OPTIONS} value={filters.hours} onChange={(value) => set('hours', value)} />
        </Section>

        <Section title="Продолжительность">
          <Segments label="Продолжительность" options={DURATION_OPTIONS} value={filters.duration} onChange={(value) => set('duration', value)} />
        </Section>

        <Section title="Стоимость" note={filters.maxPrice === 0 ? 'бесплатно' : `до ${formatMoney(filters.maxPrice)}/ч`}>
          <Slider
            label="Максимальная стоимость"
            min={0}
            max={MAX_PRICE}
            step={100}
            value={filters.maxPrice}
            onChange={(value) => set('maxPrice', value)}
            minLabel="бесплатно"
            maxLabel={formatMoney(MAX_PRICE)}
          />
        </Section>

        <Section title="Рейтинг" note={`от ${filters.minRating}`}>
          <div className={styles.stars} role="radiogroup" aria-label="Минимальный рейтинг">
            {[1, 2, 3, 4, 5].map((stars) => (
              <button
                key={stars}
                type="button"
                role="radio"
                aria-checked={filters.minRating === stars}
                aria-label={`от ${stars}`}
                className={[styles.star, stars <= filters.minRating && styles.starActive].filter(Boolean).join(' ')}
                onClick={() => set('minRating', stars)}
              >
                ★
              </button>
            ))}
          </div>
        </Section>

        <Section title="Мин. совместимость" note={`${filters.minCompatibility}%`}>
          <Slider
            label="Минимальная совместимость"
            min={0}
            max={100}
            step={5}
            value={filters.minCompatibility}
            onChange={(value) => set('minCompatibility', value)}
            minLabel="0%"
            maxLabel="100%"
          />
        </Section>
      </div>
    </aside>
  )
}

function Section({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <fieldset className={styles.section}>
      <legend className={styles.sectionHead}>
        <span className={styles.label}>{title}</span>
        {note && <span className={styles.note}>{note}</span>}
      </legend>
      {children}
    </fieldset>
  )
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.box} aria-hidden="true" />
      {label}
    </label>
  )
}

type SegmentsProps = {
  label: string
  options: { value: number; label: string; ariaLabel?: string }[]
  value: number
  onChange: (value: number) => void
}

function Segments({ label, options, value, onChange }: SegmentsProps) {
  return (
    <div className={styles.segments} role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={option.value === value}
          aria-label={option.ariaLabel}
          className={[styles.segment, option.value === value && styles.segmentActive].filter(Boolean).join(' ')}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

type SliderProps = {
  label: string
  min: number
  max: number
  step: number
  value: number
  onChange: (value: number) => void
  minLabel: string
  maxLabel: string
}

function Slider({ label, min, max, step, value, onChange, minLabel, maxLabel }: SliderProps) {
  const fill = { '--fill': `${((value - min) / (max - min)) * 100}%` } as CSSProperties
  return (
    <div className={styles.sliderBox}>
      <input
        className={styles.slider}
        style={fill}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className={styles.sliderLabels}>
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
