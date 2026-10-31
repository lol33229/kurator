import checkIcon from '@/assets/landing/check.svg'
import compatCircle from '@/assets/landing/circle-compat.svg'
import mentorAvatar from '@/assets/landing/mentor-avatar.png'
import { ButtonLink } from '@/shared/ui/Button/ButtonLink'
import styles from './LandingPage.module.css'

// Пример карточки наставника
const PREVIEW = {
  compatibility: 94,
  name: 'Алексей Сапрыкин',
  position: 'Senior Data Scientist',
  company: 'Яндекс',
  tags: ['Python', 'ML', 'SQL', 'Data Analysis', '+2'],
  reasons: [
    '7 лет опыта в ML и анализе данных',
    'Совпадает график (вечернее время)',
    'Общие профессиональные интересы',
  ],
}

export function MentorPreviewCard() {
  return (
    <article className={`${styles.card} ${styles.mentorCard}`} aria-label="Пример рекомендации наставника">
      <div className={styles.mentorTop}>
        <div className={styles.compat}>
          <img className={styles.compatCircle} src={compatCircle} alt="" width={130} height={130} />
          <span className={styles.compatValue}>{PREVIEW.compatibility}%</span>
          <span className={styles.compatLabel}>совместимость</span>
        </div>
        <img className={styles.mentorAvatar} src={mentorAvatar} alt={PREVIEW.name} width={100} height={100} />
        <div className={styles.mentorInfo}>
          <p className={styles.mentorName}>{PREVIEW.name}</p>
          <p>{PREVIEW.position}</p>
          <p>{PREVIEW.company}</p>
        </div>
      </div>

      <ul className={styles.tags}>
        {PREVIEW.tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>

      <p className={styles.reasonsTitle}>Почему подходит?</p>
      <ul className={styles.reasons}>
        {PREVIEW.reasons.map((reason) => (
          <li key={reason}>
            <img src={checkIcon} alt="" width={16} height={16} />
            {reason}
          </li>
        ))}
      </ul>

      <ButtonLink to="/register" className={styles.mentorCta}>
        Посмотреть профиль
      </ButtonLink>
    </article>
  )
}
