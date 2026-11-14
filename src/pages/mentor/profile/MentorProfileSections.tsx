import { useState, type CSSProperties } from 'react'
import { Section, SkillPairs } from '@/pages/profile/ProfileParts'
import { EXPERIENCE, MENTORSHIP, PROJECTS } from './mentorProfileData'
import styles from './MentorProfile.module.css'

type Tab = 'projects' | 'achievements'

// Ширина кнопок по макету
const TABS: { id: Tab; label: string; width: number }[] = [
  { id: 'projects', label: 'Ключевые проекты', width: 159 },
  { id: 'achievements', label: 'Достижения', width: 124 },
]

// Грамоты и сертификаты; пока нет API, файлы показываются только на экране
function Achievements() {
  const [files, setFiles] = useState<string[]>([])
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
            const names = [...(event.target.files ?? [])].map((file) => file.name)
            setFiles((current) => [...current, ...names])
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

export function ExperienceSection({ editPath }: { editPath: string }) {
  const [tab, setTab] = useState<Tab>('projects')

  return (
    <Section
      title="Профессиональный опыт"
      subtitle="Ваш опыт работы, ключевые проекты и достижения"
      action={{ to: editPath, label: 'Редактировать', icon: 'edit' }}
      className={styles.experience}
    >
      <div className={styles.experienceBody}>
        <ul className={styles.timeline}>
          {EXPERIENCE.map((item) => (
            <li key={item.id}>
              <p className={styles.timelineTitle}>{item.title}</p>
              <p className={styles.timelinePeriod}>{item.period}</p>
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
                {PROJECTS.map((project) => (
                  <li key={project.id}>
                    <p className={styles.projectTitle}>{project.title}</p>
                    <p className={styles.projectText}>{project.description}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <Achievements />
            )}
          </div>
        </div>
      </div>
    </Section>
  )
}

export function MentorshipSection({ editPath }: { editPath: string }) {
  return (
    <Section
      title="Наставничество"
      subtitle="Ваш подход, направления и предпочтения"
      action={{ to: editPath, label: 'Редактировать', icon: 'edit' }}
      className={styles.mentorship}
    >
      <dl className={styles.mentorshipList}>
        <div>
          <dt>Направления наставничества</dt>
          <dd>
            <ul className={styles.directions}>
              {MENTORSHIP.directions.map((direction) => (
                <li key={direction}>{direction}</li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt>Желаемый уровень менти</dt>
          <dd>
            <SkillPairs skills={MENTORSHIP.menteeLevels} className={styles.levels} />
          </dd>
        </div>
      </dl>
    </Section>
  )
}
