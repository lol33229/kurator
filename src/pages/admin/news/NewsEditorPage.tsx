import { useState, type DragEvent, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import pictureIcon from '@/assets/admin/picture.svg'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { Crumbs, PageTitle } from '../AdminParts'
import styles from './NewsEditor.module.css'
import { addNews, updateNews, useNews } from './newsStore'

const MAX_SIZE = 5 * 1024 * 1024
const TYPES = ['image/jpeg', 'image/png']

// Форма новой публикации; с id в адресе — редактирование
export function NewsEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = useNews().find((item) => item.id === id)

  const [title, setTitle] = useState(editing?.title ?? '')
  const [text, setText] = useState(editing?.text ?? '')
  const [image, setImage] = useState(editing?.image)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  if (id && !editing) return <PagePlaceholder title="Публикация не найдена" />

  const ready = title.trim() !== '' && text.trim() !== ''
  const heading = editing ? 'Редактирование' : 'Новая публикация'

  const pick = (file: File | undefined) => {
    if (!file) return
    if (!TYPES.includes(file.type)) return setError('Подойдёт только JPG или PNG')
    if (file.size > MAX_SIZE) return setError('Файл больше 5 МБ')
    setError('')
    setImage(URL.createObjectURL(file))
  }

  const drop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    pick(event.dataTransfer.files[0])
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    const data = { title: title.trim(), text: text.trim(), image }
    if (editing) updateNews(editing.id, data)
    else addNews(data)
    navigate('/admin/news', { state: { toast: editing ? 'Изменения сохранены' : 'Публикация опубликована' } })
  }

  return (
    <>
      <Crumbs to="/admin/news" label="Новости" current={heading} />
      <PageTitle title={heading} subtitle="Поля со звёздочкой обязательны — без них опубликовать нельзя" />

      <form className={styles.card} onSubmit={submit}>
        <label className={styles.label} htmlFor="news-title">
          Заголовок <span className={styles.star}>*</span>
        </label>
        <input
          id="news-title"
          className={styles.field}
          value={title}
          placeholder="Заголовок публикации"
          required
          onChange={(event) => setTitle(event.target.value)}
        />

        <label className={styles.label} htmlFor="news-text">
          Текст <span className={styles.star}>*</span>
        </label>
        <textarea
          id="news-text"
          className={`${styles.field} ${styles.textarea}`}
          value={text}
          placeholder="Текст публикации"
          required
          onChange={(event) => setText(event.target.value)}
        />

        <p className={`${styles.label} ${styles.imageLabel}`}>
          Изображение <span className={styles.optional}>— необязательно</span>
        </p>
        {image ? (
          <div className={styles.preview}>
            <img src={image} alt="Выбранное изображение" />
            <button type="button" className={styles.removeImage} onClick={() => setImage(undefined)}>
              Убрать
            </button>
          </div>
        ) : (
          <label
            className={[styles.drop, dragging && styles.dragging].filter(Boolean).join(' ')}
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={drop}
          >
            <input type="file" accept={TYPES.join(',')} className={styles.file} onChange={(event) => pick(event.target.files?.[0])} />
            <img src={pictureIcon} alt="" width={30} height={30} />
            <span className={styles.dropTitle}>Перетащите изображение или нажмите, чтобы выбрать</span>
            <span className={styles.dropHint}>JPG, PNG до 5 МБ · рекомендуемый размер 1200×630</span>
          </label>
        )}
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={() => navigate('/admin/news')}>
            Отмена
          </button>
          <button type="submit" className={styles.submit} disabled={!ready}>
            {editing ? 'Сохранить' : 'Опубликовать'}
          </button>
        </div>
      </form>
    </>
  )
}
