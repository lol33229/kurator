import { useState, type CSSProperties, type DragEvent } from 'react'
import { DIRECTIONS, cleanSkills } from '@/pages/profile/editOptions'
import {
  AddButton,
  EditCard,
  ErrorText,
  Field,
  RemoveButton,
  SectionLabel,
  SkillRows,
  TextInput,
  ToggleChips,
} from '@/pages/profile/ProfileEdit'
import editStyles from '@/pages/profile/ProfileEdit.module.css'
import { Section, SkillPairs } from '@/pages/profile/ProfileParts'
import { EXPERIENCE, MENTORSHIP, PROJECTS, type Job } from './mentorProfileData'
import styles from './MentorProfile.module.css'

type Tab = 'projects' | 'achievements'

// Ширина кнопок по макету
const TABS: { id: Tab; label: string; width: number }[] = [
  { id: 'projects', label: 'Ключевые проекты', width: 159 },
  { id: 'achievements', label: 'Достижения', width: 124 },
]

const EDIT = { label: 'Редактировать', icon: 'edit' as const }
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png']

type Project = { id: string; title: string; description: string }

// Проекты в поле ввода — по строке на проект: «Название — описание»
const projectsToText = (projects: Project[]) =>
  projects.map((project) => [project.title, project.description].filter(Boolean).join(' — ')).join('\n')

const textToProjects = (text: string): Project[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      const [title, ...rest] = line.split(/\s[—-]\s/)
      return { id: `p${index}`, title: title.trim(), description: rest.join(' — ').trim() }
    })

const period = (job: Job) => `${job.from} - ${job.current ? 'сейчас' : `${job.to} год`}`

// Грамоты и сертификаты; пока нет API, файлы показываются только на экране
function Achievements({ files, onAdd }: { files: string[]; onAdd: (names: string[]) => void }) {
  return (
    <div className={styles.achievements}>
      <p>Загрузите ваши грамоты/сертификаты</p>
      <label className={styles.uploadButton}>
        <input
          type="file"
          accept="image/*,application/pdf"
          multiple
          className={styles.hidden}
          onChange={(event) => {
            onAdd([...(event.target.files ?? [])].map((file) => file.name))
            event.target.value = ''
          }}
        />
        Загрузить фото
      </label>
      {files.length > 0 && (
        <ul className={styles.files}>
          {files.map((name, index) => (
            <li key={`${name}-${index}`}>{name}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

type JobErrors = Record<string, Partial<Record<'company' | 'position' | 'from' | 'to', string>>>

function validateJobs(jobs: Job[]) {
  const errors: JobErrors = {}
  const thisYear = new Date().getFullYear()
  const isYear = (value: string) => /^\d{4}$/.test(value) && Number(value) >= 1950 && Number(value) <= thisYear
  for (const job of jobs) {
    const error: JobErrors[string] = {}
    if (!job.company.trim()) error.company = 'Укажите компанию'
    if (!job.position.trim()) error.position = 'Укажите должность'
    if (!isYear(job.from)) error.from = `Год от 1950 до ${thisYear}`
    if (!job.current) {
      if (!isYear(job.to)) error.to = 'Укажите год или отметьте «Работаю сейчас»'
      else if (isYear(job.from) && Number(job.to) < Number(job.from)) error.to = 'Не раньше года начала'
    }
    if (Object.keys(error).length > 0) errors[job.id] = error
  }
  return errors
}

export function ExperienceSection() {
  const [tab, setTab] = useState<Tab>('projects')
  const [jobs, setJobs] = useState(EXPERIENCE)
  const [projects, setProjects] = useState<Project[]>(PROJECTS)
  const [files, setFiles] = useState<string[]>([])
  const [editing, setEditing] = useState(false)
  const [draftJobs, setDraftJobs] = useState(jobs)
  const [draftProjects, setDraftProjects] = useState('')
  const [draftFiles, setDraftFiles] = useState<string[]>([])
  const [errors, setErrors] = useState<JobErrors>({})
  const [fileError, setFileError] = useState<string>()
  const [dragging, setDragging] = useState(false)
  const title = 'Профессиональный опыт'
  const subtitle = 'Ваш опыт работы, ключевые проекты и достижения'

  const startEditing = () => {
    setDraftJobs(jobs)
    setDraftProjects(projectsToText(projects))
    setDraftFiles(files)
    setErrors({})
    setFileError(undefined)
    setEditing(true)
  }

  const updateJob = (id: string, patch: Partial<Job>) =>
    setDraftJobs((list) => list.map((job) => (job.id === id ? { ...job, ...patch } : job)))

  const addFiles = (list: File[]) => {
    const good = list.filter((file) => ACCEPTED.includes(file.type) && file.size <= MAX_FILE_SIZE)
    setFileError(good.length < list.length ? 'Можно загрузить PDF, JPG или PNG до 10 МБ' : undefined)
    setDraftFiles((current) => [...current, ...good.map((file) => file.name)])
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    addFiles([...event.dataTransfer.files])
  }

  const save = () => {
    const next = validateJobs(draftJobs)
    setErrors(next)
    if (Object.keys(next).length > 0) return
    // Места работы показываем по порядку: от ранних к текущему
    setJobs(
      draftJobs
        .map((job) => ({ ...job, company: job.company.trim(), position: job.position.trim(), to: job.current ? '' : job.to }))
        .sort((a, b) => Number(a.from) - Number(b.from)),
    )
    setProjects(textToProjects(draftProjects))
    setFiles(draftFiles)
    setEditing(false)
  }

  if (editing) {
    return (
      <EditCard title={title} subtitle={subtitle} onCancel={() => setEditing(false)} onSave={save}>
        <SectionLabel>Места работы</SectionLabel>
        <ul className={editStyles.blocks}>
          {draftJobs.map((job) => {
            const error = errors[job.id] ?? {}
            const text = (key: 'company' | 'position' | 'from' | 'to', label: string, placeholder: string, required = true) => (
              <Field label={label} required={required} error={error[key]}>
                {(id, describedBy) => (
                  <TextInput
                    id={id}
                    value={key === 'to' && job.current ? '' : job[key]}
                    placeholder={placeholder}
                    inputMode={key === 'from' || key === 'to' ? 'numeric' : undefined}
                    maxLength={key === 'from' || key === 'to' ? 4 : undefined}
                    disabled={key === 'to' && job.current}
                    invalid={Boolean(error[key])}
                    describedBy={describedBy}
                    onChange={(value) => updateJob(job.id, { [key]: key === 'from' || key === 'to' ? value.replace(/\D/g, '') : value })}
                  />
                )}
              </Field>
            )
            return (
              <li key={job.id} className={editStyles.block}>
                <div className={editStyles.grid}>
                  {text('company', 'Компания', 'Например: Яндекс')}
                  {text('position', 'Должность', 'Например: Senior Data Scientist')}
                  {text('from', 'Год начала', '2019')}
                  <div>
                    {text('to', 'Год окончания', job.current ? 'сейчас' : '2022', false)}
                    <label className={editStyles.checkbox}>
                      <input type="checkbox" checked={job.current} onChange={(event) => updateJob(job.id, { current: event.target.checked })} />
                      Работаю сейчас
                    </label>
                  </div>
                </div>
                <RemoveButton
                  label={`Удалить место работы ${job.company}`.trim()}
                  className={editStyles.blockRemove}
                  onClick={() => setDraftJobs((list) => list.filter((item) => item.id !== job.id))}
                />
              </li>
            )
          })}
        </ul>
        <AddButton
          label="Добавить место работы"
          onClick={() =>
            setDraftJobs((list) => [...list, { id: `job-${Date.now()}`, company: '', position: '', from: '', to: '', current: false }])
          }
        />

        <div className={editStyles.divider}>
          <Field label="Ключевые проекты">
            {(id) => (
              <>
                <textarea
                  id={id}
                  className={editStyles.input}
                  value={draftProjects}
                  placeholder="Кратко опишите 2–3 проекта, которыми гордитесь"
                  aria-describedby={`${id}-hint`}
                  onChange={(event) => setDraftProjects(event.target.value)}
                />
                <p id={`${id}-hint`} className={editStyles.photoNote}>
                  Каждый проект — с новой строки: «Название — описание».
                </p>
              </>
            )}
          </Field>
        </div>

        <div className={editStyles.divider}>
          <SectionLabel>Достижения — грамоты и сертификаты</SectionLabel>
          <label
            className={[editStyles.dropzone, dragging && editStyles.dropzoneActive].filter(Boolean).join(' ')}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept=".pdf,image/jpeg,image/png"
              multiple
              className={editStyles.hidden}
              onChange={(event) => {
                addFiles([...(event.target.files ?? [])])
                event.target.value = ''
              }}
            />
            <span>
              <b>Перетащите файлы</b> или нажмите, чтобы выбрать · PDF, JPG, PNG до 10 МБ
            </span>
          </label>
          <ErrorText>{fileError}</ErrorText>
          {draftFiles.length > 0 && (
            <ul className={editStyles.files}>
              {draftFiles.map((name, index) => (
                <li key={`${name}-${index}`}>
                  {name}
                  <RemoveButton label={`Удалить файл ${name}`} onClick={() => setDraftFiles((list) => list.filter((_, i) => i !== index))} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </EditCard>
    )
  }

  return (
    <Section title={title} subtitle={subtitle} action={{ ...EDIT, onClick: startEditing }} className={styles.experience}>
      <div className={styles.experienceBody}>
        <ul className={styles.timeline}>
          {jobs.map((job) => (
            <li key={job.id}>
              <p className={styles.timelineTitle}>
                {job.company} - {job.position}
              </p>
              <p className={styles.timelinePeriod}>{period(job)}</p>
            </li>
          ))}
        </ul>
        <div>
          <div className={styles.tabs} role="tablist" aria-label="Проекты и достижения">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`experience-tab-${item.id}`}
                aria-selected={tab === item.id}
                aria-controls="experience-panel"
                className={[styles.tab, tab === item.id && styles.tabActive].filter(Boolean).join(' ')}
                style={{ '--tab-width': `${item.width}px` } as CSSProperties}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div id="experience-panel" role="tabpanel" aria-labelledby={`experience-tab-${tab}`}>
            {tab === 'projects' ? (
              <ul className={styles.projects}>
                {projects.map((project) => (
                  <li key={project.id}>
                    <p className={styles.projectTitle}>{project.title}</p>
                    {project.description && <p className={styles.projectText}>{project.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <Achievements files={files} onAdd={(names) => setFiles((current) => [...current, ...names])} />
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}

export function MentorshipSection() {
  const [data, setData] = useState(MENTORSHIP)
  const [draft, setDraft] = useState(MENTORSHIP)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState<{ directions?: string; levels?: string }>({})
  const title = 'Наставничество'
  const subtitle = 'Ваш подход, направления и предпочтения'

  const save = () => {
    const menteeLevels = cleanSkills(draft.menteeLevels)
    const next = {
      directions: draft.directions.length ? undefined : 'Выберите хотя бы одно направление',
      levels: menteeLevels.length ? undefined : 'Добавьте хотя бы один навык',
    }
    setErrors(next)
    if (next.directions || next.levels) return
    setData({ directions: DIRECTIONS.filter((item) => draft.directions.includes(item)), menteeLevels })
    setEditing(false)
  }

  if (editing) {
    return (
      <EditCard title={title} subtitle={subtitle} onCancel={() => setEditing(false)} onSave={save}>
        <p className={editStyles.label}>
          Направления наставничества<span className={editStyles.star}> *</span>
        </p>
        <ToggleChips
          label="Направления наставничества"
          options={DIRECTIONS}
          value={draft.directions}
          invalid={Boolean(errors.directions)}
          onChange={(directions) => setDraft({ ...draft, directions })}
        />
        <ErrorText>{errors.directions}</ErrorText>
        <div className={editStyles.divider}>
          <SectionLabel note="по навыкам">Желаемый уровень менти</SectionLabel>
          <SkillRows rows={draft.menteeLevels} onChange={(menteeLevels) => setDraft({ ...draft, menteeLevels })} error={errors.levels} />
        </div>
      </EditCard>
    )
  }

  return (
    <Section
      title={title}
      subtitle={subtitle}
      action={{
        ...EDIT,
        onClick: () => {
          setDraft(data)
          setErrors({})
          setEditing(true)
        },
      }}
      className={styles.mentorship}
    >
      <dl className={styles.mentorshipList}>
        <div>
          <dt>Направления наставничества</dt>
          <dd>
            <ul className={styles.directions}>
              {data.directions.map((direction) => (
                <li key={direction}>{direction}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Желаемый уровень менти</dt>
          <dd>
            <SkillPairs skills={data.menteeLevels} className={styles.levels} />
          </dd>
        </div>
      </dl>
    </Section>
  )
}
