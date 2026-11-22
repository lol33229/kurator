import { useEffect, useState } from 'react'
import avatarEditIcon from '@/assets/icons/avatar-edit.svg'
import calendarIcon from '@/assets/icons/calendar-small.svg'
import clockIcon from '@/assets/icons/clock.svg'
import rubleIcon from '@/assets/icons/ruble.svg'
import videoIcon from '@/assets/icons/video.svg'
import { MEETING_FORMATS, POPULAR_SKILLS, PRICE_MODELS, TIMEZONES, WEEKDAYS, cleanSkills, yearsLabel } from './editOptions'
import { EditCard, ErrorText, Field, Select, SkillRows, TextInput, ToggleChips } from './ProfileEdit'
import editStyles from './ProfileEdit.module.css'
import { Section, SkillPairs, type SkillLevel } from './ProfileParts'
import styles from './Profile.module.css'

const EDIT = { label: 'Редактировать', icon: 'edit' as const }

// ---------- Личные данные ----------

export type PersonalData = {
  firstName: string
  lastName: string
  age: string
  status: string
  university: string
  specialty: string
  city: string
  about: string
}

const ABOUT_LIMIT = 300

// Фото профиля; пока нет API, новое фото видно только на экране
function useObjectUrl(initial: string) {
  const [photo, setPhoto] = useState(initial)
  useEffect(() => () => URL.revokeObjectURL(photo), [photo])
  return [photo, (file: File) => setPhoto(URL.createObjectURL(file))] as const
}

type PersonalSectionProps = {
  subtitle: string
  photo: string
  initial: PersonalData
}

export function PersonalSection({ subtitle, photo: initialPhoto, initial }: PersonalSectionProps) {
  const [data, setData] = useState(initial)
  const [draft, setDraft] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof PersonalData, string>>>({})
  const [photo, setPhoto] = useObjectUrl(initialPhoto)

  const set = (key: keyof PersonalData) => (value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const startEditing = () => {
    setDraft(data)
    setErrors({})
    setEditing(true)
  }

  const save = () => {
    const required: (keyof PersonalData)[] = ['firstName', 'lastName', 'age', 'status', 'university', 'city']
    const next: typeof errors = {}
    for (const key of required) if (!draft[key].trim()) next[key] = 'Заполните поле'
    const age = Number(draft.age)
    if (draft.age && (!Number.isInteger(age) || age < 14 || age > 99)) next.age = 'Возраст от 14 до 99'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    setData(draft)
    setEditing(false)
  }

  const photoInput = (
    <input
      type="file"
      accept="image/png,image/jpeg"
      className={editStyles.hidden}
      onChange={(event) => {
        const file = event.target.files?.[0]
        if (file) setPhoto(file)
        event.target.value = ''
      }}
    />
  )

  if (editing) {
    const text = (key: keyof PersonalData, label: string, options: { required?: boolean; optional?: boolean; numeric?: boolean } = {}) => (
      <Field label={label} required={options.required} optional={options.optional} error={errors[key]}>
        {(id, describedBy) => (
          <TextInput
            id={id}
            value={draft[key]}
            onChange={set(key)}
            invalid={Boolean(errors[key])}
            describedBy={describedBy}
            inputMode={options.numeric ? 'numeric' : undefined}
          />
        )}
      </Field>
    )
    return (
      <EditCard title="Личные данные" subtitle={subtitle} onCancel={() => setEditing(false)} onSave={save}>
        <div className={editStyles.photoRow}>
          <img className={editStyles.photo} src={photo} alt="Фото профиля" width={84} height={84} />
          <div>
            <label className={editStyles.upload}>
              {photoInput}
              Загрузить фото
            </label>
            <p className={editStyles.photoNote}>JPG или PNG, до 5 МБ. Лицо крупно, хорошее освещение.</p>
          </div>
        </div>
        <div className={`${editStyles.grid} ${editStyles.afterPhoto}`}>
          {text('firstName', 'Имя', { required: true })}
          {text('lastName', 'Фамилия', { required: true })}
          {text('age', 'Возраст', { required: true, numeric: true })}
          {text('status', 'Статус', { required: true })}
          {text('university', 'Вуз', { required: true })}
          {text('specialty', 'Специальность', { optional: true })}
          {text('city', 'Город', { required: true })}
          <Field label="О себе" optional className={editStyles.wide}>
            {(id) => (
              <>
                <textarea
                  id={id}
                  className={editStyles.input}
                  value={draft.about}
                  maxLength={ABOUT_LIMIT}
                  onChange={(event) => set('about')(event.target.value)}
                />
                <p className={editStyles.counter} aria-live="polite">
                  {draft.about.length}/{ABOUT_LIMIT}
                </p>
              </>
            )}
          </Field>
        </div>
      </EditCard>
    )
  }

  const fields = [
    { label: 'Имя и фамилия', value: `${data.firstName} ${data.lastName}` },
    { label: 'Возраст', value: yearsLabel(data.age) },
    { label: 'Статус', value: data.status },
    { label: 'Образование', value: [data.university, data.specialty].filter(Boolean).join(', ') },
    { label: 'Город', value: data.city },
    { label: 'О себе', value: data.about || '—' },
  ]

  return (
    <Section
      title="Личные данные"
      subtitle={subtitle}
      action={{ ...EDIT, onClick: () => startEditing() }}
      className={styles.personal}
    >
      <div className={styles.personalBody}>
        <div className={styles.photo}>
          <img className={styles.photoImage} src={photo} alt="Фото профиля" width={100} height={100} />
          <label className={styles.photoEdit}>
            {photoInput}
            <img src={avatarEditIcon} alt="" width={30} height={30} />
            <span className={styles.hidden}>Сменить фото</span>
          </label>
        </div>
        <dl className={styles.fields}>
          {fields.map((field) => (
            <div key={field.label}>
              <dt>{field.label}</dt>
              <dd>{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}

// ---------- Навыки ----------

export function SkillsSection({ skills: initial }: { skills: SkillLevel[] }) {
  const [skills, setSkills] = useState(initial)
  const [draft, setDraft] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string>()
  const title = 'Интересы и навыки'
  const subtitle = 'Области, которые вам интересны и ваши текущие навыки и уровень владения'
  const startEditing = () => {
    setDraft(skills)
    setError(undefined)
    setEditing(true)
  }

  const save = () => {
    const next = cleanSkills(draft)
    if (next.length === 0) return setError('Добавьте хотя бы один навык')
    setSkills(next)
    setEditing(false)
  }

  if (editing) {
    return (
      <EditCard title={title} subtitle={subtitle} onCancel={() => setEditing(false)} onSave={save}>
        <SkillRows rows={draft} onChange={setDraft} popular={POPULAR_SKILLS} error={error} />
      </EditCard>
    )
  }

  return (
    <Section
      title={title}
      subtitle={subtitle}
      action={{ ...EDIT, onClick: () => startEditing() }}
      className={styles.skills}
    >
      <SkillPairs skills={skills} />
    </Section>
  )
}

// ---------- Доступность ----------

export type AvailabilityData = {
  days: string[]
  from: string
  to: string
  timezone: string
  formats: string[]
  city: string
  // Только у ментора
  priceModel?: string
  price?: string
}

function priceLabel(data: AvailabilityData) {
  if (data.priceModel === 'Бесплатно') return 'Бесплатно'
  const unit: Record<string, string> = {
    'За час': '1 час',
    'За сессию': '1 сессия',
    'Пакет занятий': 'Пакет занятий',
    'Подписка на месяц': '1 месяц',
  }
  return `${unit[data.priceModel ?? ''] ?? data.priceModel} / ${data.price} рублей`
}

type AvailabilityErrors = Partial<Record<'days' | 'time' | 'formats' | 'price', string>>

export function AvailabilitySection({ subtitle, initial }: { subtitle: string; initial: AvailabilityData }) {
  const [data, setData] = useState(initial)
  const [draft, setDraft] = useState(initial)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState<AvailabilityErrors>({})
  const withPrice = initial.priceModel !== undefined
  const startEditing = () => {
    setDraft(data)
    setErrors({})
    setEditing(true)
  }

  const save = () => {
    const next: AvailabilityErrors = {}
    if (draft.days.length === 0) next.days = 'Выберите хотя бы один день'
    if (!draft.from || !draft.to || draft.from >= draft.to) next.time = 'Время окончания должно быть позже начала'
    if (draft.formats.length === 0) next.formats = 'Выберите формат'
    if (withPrice && draft.priceModel !== 'Бесплатно' && !(Number(draft.price) > 0)) next.price = 'Укажите цену'
    setErrors(next)
    if (Object.keys(next).length > 0) return
    // Дни храним в порядке недели
    setData({ ...draft, days: WEEKDAYS.filter((day) => draft.days.includes(day)), city: draft.city.trim() })
    setEditing(false)
  }

  if (editing) {
    const patch = (value: Partial<AvailabilityData>) => setDraft((current) => ({ ...current, ...value }))
    return (
      <EditCard title="Доступность" subtitle={subtitle} onCancel={() => setEditing(false)} onSave={save}>
        <p className={editStyles.label}>
          Дни недели<span className={editStyles.star}> *</span>
        </p>
        <ToggleChips label="Дни недели" options={WEEKDAYS} value={draft.days} onChange={(days) => patch({ days })} invalid={Boolean(errors.days)} />
        <ErrorText>{errors.days}</ErrorText>

        <div className={`${editStyles.grid} ${editStyles.afterChips}`}>
          <div>
            <p className={editStyles.label}>
              Время<span className={editStyles.star}> *</span>
            </p>
            <div className={editStyles.timeRange}>
              <TextInput type="time" label="Время с" value={draft.from} onChange={(from) => patch({ from })} invalid={Boolean(errors.time)} />
              <span aria-hidden="true">—</span>
              <TextInput type="time" label="Время до" value={draft.to} onChange={(to) => patch({ to })} invalid={Boolean(errors.time)} />
            </div>
            <ErrorText>{errors.time}</ErrorText>
          </div>
          <Field label="Часовой пояс" required>
            {(id) => <Select id={id} value={draft.timezone} options={TIMEZONES} onChange={(timezone) => patch({ timezone })} />}
          </Field>
          <div>
            <p className={editStyles.label}>
              Формат<span className={editStyles.star}> *</span>
            </p>
            <ToggleChips label="Формат" options={MEETING_FORMATS} value={draft.formats} onChange={(formats) => patch({ formats })} invalid={Boolean(errors.formats)} />
            <ErrorText>{errors.formats}</ErrorText>
          </div>
          <Field label="Город для офлайн-встреч">
            {(id) => <TextInput id={id} value={draft.city} onChange={(city) => patch({ city })} disabled={!draft.formats.includes('Офлайн')} />}
          </Field>
          {withPrice && (
            <>
              <Field label="Модель стоимости" required>
                {(id) => <Select id={id} value={draft.priceModel ?? PRICE_MODELS[0]} options={PRICE_MODELS} onChange={(priceModel) => patch({ priceModel })} />}
              </Field>
              <Field label="Цена, ₽" required error={errors.price}>
                {(id, describedBy) => (
                  <TextInput
                    id={id}
                    value={draft.priceModel === 'Бесплатно' ? '' : (draft.price ?? '')}
                    onChange={(price) => patch({ price: price.replace(/\D/g, '') })}
                    inputMode="numeric"
                    disabled={draft.priceModel === 'Бесплатно'}
                    invalid={Boolean(errors.price)}
                    describedBy={describedBy}
                  />
                )}
              </Field>
            </>
          )}
        </div>
      </EditCard>
    )
  }

  const formats = data.formats.map((format) => format.toLowerCase())
  const formatText = data.formats.includes('Офлайн') && data.city
    ? formats.map((format) => (format === 'офлайн' ? `офлайн (${data.city})` : format)).join(', ')
    : formats.join(', ')
  const rows = [
    { icon: calendarIcon, label: 'Дни', value: data.days.join(', ') },
    { icon: clockIcon, label: 'Время', value: `${data.from} - ${data.to} (${data.timezone})` },
    { icon: videoIcon, label: 'Формат', value: formatText.charAt(0).toUpperCase() + formatText.slice(1) },
    ...(withPrice ? [{ icon: rubleIcon, label: 'Модель стоимости и цена', value: priceLabel(data) }] : []),
  ]

  return (
    <Section
      title="Доступность"
      subtitle={subtitle}
      action={{ ...EDIT, onClick: () => startEditing() }}
      className={styles.availability}
    >
      <dl className={styles.availabilityList}>
        {rows.map((row) => (
          <div key={row.label}>
            <dt>
              <img src={row.icon} alt="" width={20} height={20} />
              {row.label}
            </dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
