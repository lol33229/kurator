import { useState } from 'react'
import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { STUDENT } from '@/pages/student/data'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import { NEWS } from './newsData'
import { NewsCover, NewsDate, ReadLink } from './NewsParts'
import styles from './News.module.css'

// Сколько обычных новостей видно до «Показать ещё»
const PAGE_SIZE = 3

// Лента новостей
export function NewsPage() {
  const [expanded, setExpanded] = useState(false)
  const featured = NEWS.find((item) => item.featured)
  const rest = NEWS.filter((item) => item !== featured)
  const visible = expanded ? rest : rest.slice(0, PAGE_SIZE)

  return (
    <div className={`${landingStyles.page} ${styles.page}`}>
      {/* Пока нет авторизации, шапка как у менти */}
      <UserHeader name={STUDENT.shortName} roleLabel="менти" avatar={STUDENT.avatar} profilePath="/student/profile" />
      <main className={styles.main}>
        <h1 className={styles.title}>Новости</h1>
        <p className={styles.subtitle}>Анонсы событий, обновления платформы и истории наших менторов и менти.</p>

        {featured && (
          <article className={styles.featured}>
            <NewsCover item={featured} size="lg" className={styles.featuredCover} />
            <div className={styles.featuredText}>
              <p className={styles.badge}>Главное</p>
              <NewsDate date={featured.date} className={styles.featuredDate} />
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              <p className={styles.featuredSummary}>{featured.summary}</p>
              <ReadLink id={featured.id} title={featured.title} />
            </div>
          </article>
        )}

        <ul className={styles.grid}>
          {visible.map((item) => (
            <li key={item.id}>
              <article className={[styles.card, !item.cover && styles.cardText].filter(Boolean).join(' ')}>
                <NewsCover item={item} size="sm" />
                <div className={styles.cardBody}>
                  <NewsDate date={item.date} />
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                  <p className={styles.cardSummary}>{item.summary}</p>
                  <ReadLink id={item.id} title={item.title} />
                </div>
              </article>
            </li>
          ))}
        </ul>

        {!expanded && rest.length > PAGE_SIZE && (
          <button type="button" className={styles.more} onClick={() => setExpanded(true)}>
            Показать ещё
          </button>
        )}
      </main>
      <LandingFooter />
    </div>
  )
}
