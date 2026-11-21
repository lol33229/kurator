import { useEffect } from 'react'
import { Initials } from './MentorResultCard'
import { MAX_COMPARE, type SearchMentor } from './data'
import styles from './MentorSearch.module.css'

type CompareBarProps = {
  mentors: SearchMentor[]
  onOpen: () => void
}

// Плавающая панель сравнения внизу экрана
export function CompareBar({ mentors, onOpen }: CompareBarProps) {
  return (
    <div className={styles.compareBar} role="region" aria-label="Сравнение">
      <p className={styles.compareCount}>
        Сравнение{' '}
        <span className={styles.compareCountValue}>
          {mentors.length}/{MAX_COMPARE}
        </span>
      </p>
      {mentors.length > 0 && (
        <ul className={styles.compareAvatars} aria-label="Выбраны для сравнения">
          {mentors.map((mentor) => (
            <li key={mentor.id} title={mentor.name}>
              <Initials mentor={mentor} size={34} className={styles.compareAvatar} />
              <span className={styles.visuallyHidden}>{mentor.name}</span>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className={styles.compareButton} onClick={onOpen}>
        Сравнить
      </button>
    </div>
  )
}

// Предупреждение, когда в сравнении уже три наставника
export function CompareLimitWarning({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 6000)
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className={styles.warning} role="alert">
      <div>
        <p className={styles.warningTitle}>Можно сравнить не более {MAX_COMPARE} наставников</p>
        <p className={styles.warningText}>Уберите кого-то из сравнения, чтобы добавить нового</p>
      </div>
      <button type="button" className={styles.warningButton} onClick={onClose}>
        К списку
      </button>
    </div>
  )
}
