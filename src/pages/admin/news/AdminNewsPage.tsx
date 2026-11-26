import { Link } from 'react-router'
import { Toast } from '@/shared/ui/Toast/Toast'
import { PageTitle } from '../AdminParts'
import { useRouteToast } from '../useRouteToast'
import styles from './AdminNews.module.css'
import { removeNews, useNews } from './newsStore'

// Список публикаций с редактированием и удалением
export function AdminNewsPage() {
  const news = useNews()
  // Сообщение после публикации приходит со страницы формы
  const { toast, setToast, hideToast } = useRouteToast()

  return (
    <>
      <div className={styles.head}>
        <PageTitle title="Новости" subtitle="Публикации, которые видят менторы и менти" />
        <Link to="/admin/news/new" className={styles.create}>
          ＋ Создать
        </Link>
      </div>

      <div className={styles.card}>
        {news.length > 0 ? (
          <ul className={styles.list}>
            {news.map((item) => (
              <li key={item.id} className={styles.item}>
                <div className={styles.thumb}>
                  {item.image ? (
                    <img src={item.image} alt="" className={styles.photo} />
                  ) : item.icon ? (
                    <img src={item.icon} alt="" width={20} height={20} />
                  ) : (
                    <span className={styles.noPhoto}>без фото</span>
                  )}
                </div>
                <div className={styles.text}>
                  <p className={styles.title}>{item.title}</p>
                  <p className={styles.excerpt}>{item.text}</p>
                  <p className={styles.date}>{item.date}</p>
                </div>
                <div className={styles.actions}>
                  <Link to={`/admin/news/${item.id}/edit`} className={styles.edit} aria-label={`Редактировать: ${item.title}`}>
                    Редактировать
                  </Link>
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={`Удалить: ${item.title}`}
                    onClick={() => {
                      removeNews(item.id)
                      setToast('Материал удален')
                    }}
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Публикаций пока нет</p>
        )}
      </div>

      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
