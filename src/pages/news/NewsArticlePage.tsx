import { Link, useParams } from 'react-router'
import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { STUDENT } from '@/pages/student/data'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import { findNews, type NewsBlock } from './newsData'
import { NewsCover, NewsDate } from './NewsParts'
import styles from './News.module.css'

function Block({ block }: { block: NewsBlock }) {
  if (block.type === 'h2') return <h2 className={styles.articleHeading}>{block.text}</h2>
  if (block.type === 'ul')
    return (
      <ul className={styles.articleList}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  return <p className={styles.articleText}>{block.text}</p>
}

// Открытая новость
export function NewsArticlePage() {
  const item = findNews(useParams().id)
  if (!item) return <PagePlaceholder title="Новость не найдена" />

  return (
    <div className={`${landingStyles.page} ${styles.page} ${styles.articlePage}`}>
      <UserHeader name={STUDENT.shortName} roleLabel="менти" avatar={STUDENT.avatar} profilePath="/student/profile" />
      <main className={styles.articleMain}>
        <Link to="/news" className={`${styles.backButton} ${styles.backTop}`}>
          ← Назад
        </Link>
        <article className={styles.article}>
          <NewsDate date={item.date} />
          <h1 className={styles.articleTitle}>{item.title}</h1>
          <NewsCover item={item} size="lg" className={styles.articleCover} />
          <div className={styles.articleBody}>
            {item.body.map((block, index) => (
              <Block key={index} block={block} />
            ))}
          </div>
          <footer className={styles.articleFooter}>
            <Link to="/news" className={styles.backButton}>
              ← Назад к новостям
            </Link>
            <span className={styles.articleFooterDate}>{item.date}</span>
          </footer>
        </article>
      </main>
      <LandingFooter />
    </div>
  )
}
