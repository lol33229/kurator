import { Link, useNavigate, useParams } from 'react-router'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { Toast } from '@/shared/ui/Toast/Toast'
import { Crumbs, PageTitle } from '../AdminParts'
import { useRouteToast } from '../useRouteToast'
import styles from './Knowledge.module.css'
import { removeKnowledge, useKnowledge } from './knowledgeStore'

// Просмотр материала: заголовок, формулировки вопроса и ответ бота
export function KnowledgeItemPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const item = useKnowledge().find((entry) => entry.id === id)
  // После сохранения формы сюда приходит уведомление
  const { toast, hideToast } = useRouteToast()

  if (!item) return <PagePlaceholder title="Материал не найден" />

  const remove = () => {
    removeKnowledge(item.id)
    navigate('/admin/knowledge', { state: { toast: 'Материал удален' } })
  }

  return (
    <>
      <Crumbs to="/admin/knowledge" label="База знаний" current={item.title} />
      <div className={styles.head}>
        <PageTitle title={item.title} subtitle={`Обновлено ${item.updated}`} />
        <div className={styles.headActions}>
          <button type="button" className={styles.danger} onClick={remove}>
            Удалить
          </button>
          <Link to={`/admin/knowledge/${item.id}/edit`} className={styles.primary}>
            Редактировать
          </Link>
        </div>
      </div>

      <div className={`${styles.form} ${styles.view}`}>
        <p className={styles.label}>
          Заголовок <span className={styles.star}>*</span>
        </p>
        <p className={styles.readonly}>{item.title}</p>

        <p className={styles.label}>
          Вопрос / тема <span className={styles.star}>*</span> <span className={styles.hint}>— варианты формулировок, по которым бот узнает вопрос</span>
        </p>
        <ul className={styles.questions}>
          {item.questions.map((question, index) => (
            <li key={index} className={styles.readonly}>
              {question}
            </li>
          ))}
        </ul>

        <p className={styles.label}>
          Ответ <span className={styles.star}>*</span>
        </p>
        <p className={`${styles.readonly} ${styles.answer}`}>{item.answer}</p>
      </div>

      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
