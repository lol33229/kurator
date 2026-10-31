import avatarPlaceholder from '@/assets/home/avatar-placeholder.svg'
import checkIcon from '@/assets/landing/check.svg'
import compatCircle from '@/assets/landing/circle-compat.svg'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { ButtonLink } from '@/shared/ui/Button/ButtonLink'
import styles from './HomePage.module.css'

export type Recommendation = {
  compatibility: number
  // Фамилия и фото скрыты до начала менторства
  displayName: string
  direction: string
  tags: string[]
  reasons: string[]
  profilePath: string
}

type RecommendationCardProps = {
  recommendation: Recommendation
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { compatibility, displayName, direction, tags, reasons, profilePath } = recommendation

  return (
    <article className={`${landingStyles.card} ${styles.recommendation}`} aria-label="Рекомендованный наставник">
      <div className={styles.recommendationTop}>
        <div className={styles.compat}>
          <img className={styles.compatCircle} src={compatCircle} alt="" width={130} height={130} />
          <span className={styles.compatValue}>{compatibility}%</span>
          <span className={styles.compatLabel}>совместимость</span>
        </div>
        <img className={styles.avatar} src={avatarPlaceholder} alt="" width={100} height={100} />
        <div className={styles.mentorInfo}>
          <p className={styles.mentorName}>{displayName}</p>
          <p className={styles.mentorDirection}>{direction}</p>
        </div>
      </div>

      <ul className={styles.tags}>
        {tags.map((tag) => (
          <li key={tag} className={styles.tag}>
            {tag}
          </li>
        ))}
      </ul>

      <p className={styles.reasonsTitle}>Почему подходит?</p>
      <ul className={styles.reasons}>
        {reasons.map((reason) => (
          <li key={reason}>
            <img src={checkIcon} alt="" width={16} height={16} />
            {reason}
          </li>
        ))}
      </ul>

      <ButtonLink to={profilePath} className={styles.profileCta}>
        Посмотреть профиль
      </ButtonLink>
    </article>
  )
}
