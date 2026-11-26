import { useState } from 'react'
import { Link } from 'react-router'
import { Toast } from '@/shared/ui/Toast/Toast'
import { PageTitle } from '../AdminParts'
import t from '../AdminTable.module.css'
import { useRouteToast } from '../useRouteToast'
import styles from './Knowledge.module.css'
import { useKnowledge } from './knowledgeStore'

// Материалы базы знаний ИИ-бота с поиском
export function KnowledgePage() {
  const [query, setQuery] = useState('')
  // После удаления на странице материала сюда приходит уведомление
  const { toast, hideToast } = useRouteToast()

  const search = query.trim().toLowerCase()
  const visible = useKnowledge().filter(
    (item) =>
      !search || item.title.toLowerCase().includes(search) || item.questions.some((question) => question.toLowerCase().includes(search)),
  )

  return (
    <>
      <div className={styles.head}>
        <PageTitle title="База знаний ИИ-чат бота" subtitle="Материалы, на основе которых бот отвечает пользователям" />
        <Link to="/admin/knowledge/new" className={styles.primary}>
          ＋ Добавить материал
        </Link>
      </div>

      <label className={styles.search}>
        <span className={t.hidden}>Поиск</span>
        <input type="search" value={query} placeholder="Поиск по заголовку или вопросу" onChange={(event) => setQuery(event.target.value)} />
      </label>

      <div className={`${t.card} ${styles.card}`}>
        <table className={`${t.table} ${styles.table}`}>
          <thead>
            <tr>
              <th>Заголовок</th>
              <th>Вариантов вопроса</th>
              <th>Дата обновления</th>
              <th>
                <span className={t.hidden}>Действия</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((item) => (
              <tr key={item.id}>
                <td className={styles.titleCell}>
                  <p className={t.name}>{item.title}</p>
                  <p className={t.sub}>{item.questions[0]}</p>
                </td>
                <td className={styles.countCell}>
                  <span className={styles.mobileLabel}>Вариантов вопроса: </span>
                  {item.questions.length}
                </td>
                <td className={styles.dateCell}>{item.updated}</td>
                <td className={styles.openCell}>
                  <Link to={`/admin/knowledge/${item.id}`} className={styles.open} aria-label={`Открыть: ${item.title}`}>
                    Открыть
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p className={t.empty}>Ничего не нашли</p>}
      </div>

      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
