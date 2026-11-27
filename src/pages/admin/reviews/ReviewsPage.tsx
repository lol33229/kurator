import { useCallback, useState } from 'react'
import { REASON_TEXT } from '@/shared/api/moderation'
import { Toast } from '@/shared/ui/Toast/Toast'
import { Filters, PageTitle, PersonCell, Pill } from '../AdminParts'
import t from '../AdminTable.module.css'
import { useUsers } from '../users/usersStore'
import styles from './Reviews.module.css'
import { REVIEW_STATUSES, setReviewStatus, useReviews } from './reviewsStore'

const FILTERS = ['Все', ...REVIEW_STATUSES] as const
type Filter = (typeof FILTERS)[number]

// Отзывы, которые ИИ-модерация отправила куратору на проверку
export function ReviewsPage() {
  const [filter, setFilter] = useState<Filter>('На проверке')
  const [toast, setToast] = useState<string | null>(null)
  const hideToast = useCallback(() => setToast(null), [setToast])
  const users = useUsers()
  const visible = useReviews().filter((review) => filter === 'Все' || review.status === filter)

  // Цвет аватара берём из пользователей админки, у гостей с сайта — нейтральный
  const colorOf = (id: string) => users.find((user) => user.id === id)?.color ?? '#9ea3b5'

  const decide = (id: string, publish: boolean) => {
    setReviewStatus(id, publish ? 'Опубликован' : 'Отклонён')
    setToast(publish ? 'Отзыв опубликован' : 'Отзыв отклонён')
  }

  return (
    <>
      <PageTitle title="Отзывы" subtitle="Отзывы, которые ИИ-модерация отправила на проверку куратору" />
      <Filters label="Статус отзыва" options={FILTERS} value={filter} onChange={setFilter} className={styles.filters} />

      <div className={`${t.card} ${styles.card}`}>
        <table className={`${t.table} ${styles.table}`}>
          <thead>
            <tr>
              <th>Автор</th>
              <th>О ком</th>
              <th>Отзыв</th>
              <th>Статус</th>
              <th>
                <span className={t.hidden}>Действия</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((review) => (
              <tr key={review.id}>
                <td className={styles.authorCell}>
                  <PersonCell name={review.author.name} sub={`${review.author.role} · ${review.date}`} color={colorOf(review.author.id)} />
                </td>
                <td className={styles.targetCell}>
                  <p className={t.name}>{review.target.name}</p>
                  <p className={t.sub}>{review.target.role}</p>
                </td>
                <td className={styles.textCell}>
                  <p className={styles.rating} aria-label={`Оценка ${review.rating} из 5`}>
                    {'★'.repeat(review.rating)}
                    <span className={styles.ratingEmpty}>{'★'.repeat(5 - review.rating)}</span>
                  </p>
                  <p className={styles.text}>{review.text}</p>
                  {review.reasons.length > 0 && (
                    <p className={styles.reasons}>ИИ: {review.reasons.map((reason) => REASON_TEXT[reason]).join(', ')}</p>
                  )}
                </td>
                <td className={styles.statusCell}>
                  <Pill>{review.status}</Pill>
                </td>
                <td className={styles.actionsCell}>
                  {review.status === 'На проверке' && (
                    <div className={styles.actions}>
                      <button type="button" className={styles.publish} onClick={() => decide(review.id, true)}>
                        Опубликовать
                      </button>
                      <button type="button" className={styles.reject} onClick={() => decide(review.id, false)}>
                        Отклонить
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <p className={t.empty}>{filter === 'На проверке' ? 'Все отзывы проверены' : 'Отзывов нет'}</p>}
      </div>

      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
