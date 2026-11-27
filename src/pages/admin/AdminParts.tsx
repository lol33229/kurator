import type { CSSProperties } from 'react'
import { Link } from 'react-router'
import { initials } from './adminData'
import styles from './AdminParts.module.css'
import t from './AdminTable.module.css'

// Общие мелочи панели куратора

export function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span className={styles.avatar} style={{ background: color }} aria-hidden="true">
      {initials}
    </span>
  )
}

// Цвета плашек по тексту
const PILL_COLORS: Record<string, [string, string]> = {
  Ментор: ['#e6e1ff', '#5b3fc4'],
  Менти: ['#dceeff', '#1f5e99'],
  Куратор: ['#e3f9b8', '#2f4a00'],
  Активен: ['#ddf2e8', '#2e7d5b'],
  Активна: ['#ddf2e8', '#2e7d5b'],
  Решена: ['#ddf2e8', '#2e7d5b'],
  Заблокирован: ['#fde7e7', '#e5484d'],
  Новая: ['#fde7e7', '#e5484d'],
  'На проверке': ['#fce6bf', '#9a5b00'],
  'Требует внимания': ['#fce6bf', '#9a5b00'],
  'На рассмотрении': ['#fce6bf', '#9a5b00'],
  warning: ['#fce6bf', '#9a5b00'],
  'Повторный подбор': ['#dceeff', '#1f5e99'],
  Завершена: ['#edeeea', '#4a5065'],
  Новое: ['#fce6bf', '#9a5b00'],
  Решено: ['#ddf2e8', '#2e7d5b'],
  'Ждёт оператора': ['#fde7e7', '#e5484d'],
  'В работе': ['#fce6bf', '#9a5b00'],
  Завершён: ['#edeeea', '#4a5065'],
  Опубликован: ['#ddf2e8', '#2e7d5b'],
  Отклонён: ['#fde7e7', '#e5484d'],
}

// tone — цвет, если текст плашки не совпадает с ключом
export function Pill({ children, tone }: { children: string; tone?: string }) {
  const [bg, color] = PILL_COLORS[tone ?? children] ?? ['#f3f4ef', '#4a5065']
  return (
    <span className={styles.pill} style={{ '--pill-bg': bg, '--pill-color': color } as CSSProperties}>
      {children}
    </span>
  )
}

export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  )
}

type FiltersProps<T extends string> = {
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  className?: string
}

// Белый переключатель «Все / …» над таблицей
export function Filters<T extends string>({ label, options, value, onChange, className }: FiltersProps<T>) {
  return (
    <div className={[t.filters, className].filter(Boolean).join(' ')} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={value === option}
          className={[t.filter, value === option && t.filterActive].filter(Boolean).join(' ')}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

// Аватар с именем и подписью — первая ячейка таблиц
export function PersonCell({ name, sub, color }: { name: string; sub: string; color: string }) {
  return (
    <div className={t.person}>
      <Avatar initials={initials(name)} color={color} />
      <div>
        <p className={t.name}>{name}</p>
        <p className={t.sub}>{sub}</p>
      </div>
    </div>
  )
}

// Цепочка «Раздел › Текущая страница»
export function Crumbs({ to, label, current }: { to: string; label: string; current: string }) {
  return (
    <nav className={styles.crumbs} aria-label="Навигация">
      <Link to={to}>{label}</Link>
      <span aria-current="page"> › {current}</span>
    </nav>
  )
}
