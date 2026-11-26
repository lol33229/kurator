import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router'
import { PagePlaceholder } from '@/shared/ui/PagePlaceholder'
import { Crumbs, PageTitle } from '../AdminParts'
import styles from './Knowledge.module.css'
import { addKnowledge, updateKnowledge, useKnowledge } from './knowledgeStore'

// Форма нового материала; с id в адресе — редактирование
export function KnowledgeEditorPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = useKnowledge().find((item) => item.id === id)

  const [title, setTitle] = useState(editing?.title ?? '')
  const [questions, setQuestions] = useState(editing?.questions ?? [''])
  const [answer, setAnswer] = useState(editing?.answer ?? '')

  if (id && !editing) return <PagePlaceholder title="Материал не найден" />

  const filled = questions.map((question) => question.trim()).filter(Boolean)
  const ready = title.trim() !== '' && filled.length > 0 && answer.trim() !== ''
  const back = editing ? `/admin/knowledge/${editing.id}` : '/admin/knowledge'

  const setQuestion = (index: number, value: string) =>
    setQuestions((list) => list.map((question, i) => (i === index ? value : question)))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!ready) return
    const data = { title: title.trim(), questions: filled, answer: answer.trim() }
    if (editing) {
      updateKnowledge(editing.id, data)
      navigate(back, { state: { toast: 'Изменения сохранены' } })
    } else {
      addKnowledge(data)
      navigate(back, { state: { toast: 'Материал добавлен' } })
    }
  }

  return (
    <>
      <Crumbs to="/admin/knowledge" label="База знаний" current={editing ? editing.title : 'Новый материал'} />
      <PageTitle
        title={editing ? 'Редактирование' : 'Новый материал'}
        subtitle={editing ? `Обновлено ${editing.updated}` : 'Бот будет отвечать этим текстом на похожие вопросы'}
      />

      <form className={styles.form} onSubmit={submit}>
        <label className={styles.label} htmlFor="kb-title">
          Заголовок <span className={styles.star}>*</span>
        </label>
        <input
          id="kb-title"
          className={styles.field}
          value={title}
          placeholder="Например: Как перенести встречу"
          required
          onChange={(event) => setTitle(event.target.value)}
        />

        <p className={styles.label} id="kb-questions">
          Вопрос / тема <span className={styles.star}>*</span> <span className={styles.hint}>— варианты формулировок, по которым бот узнает вопрос</span>
        </p>
        <ul className={styles.questions} aria-labelledby="kb-questions">
          {questions.map((question, index) => (
            <li key={index} className={styles.questionRow}>
              <input
                className={styles.field}
                value={question}
                placeholder="Как пользователь может спросить"
                aria-label={`Формулировка ${index + 1}`}
                onChange={(event) => setQuestion(index, event.target.value)}
              />
              {index > 0 && (
                <button
                  type="button"
                  className={styles.removeQuestion}
                  aria-label={`Удалить формулировку ${index + 1}`}
                  onClick={() => setQuestions((list) => list.filter((_, i) => i !== index))}
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
        <button type="button" className={styles.addQuestion} onClick={() => setQuestions((list) => [...list, ''])}>
          ＋ Добавить вариант формулировки
        </button>

        <label className={`${styles.label} ${styles.answerLabel}`} htmlFor="kb-answer">
          Ответ <span className={styles.star}>*</span>
        </label>
        <textarea
          id="kb-answer"
          className={`${styles.field} ${styles.textarea}`}
          value={answer}
          placeholder="Текст, который увидит пользователь"
          required
          onChange={(event) => setAnswer(event.target.value)}
        />

        <div className={styles.footer}>
          <button type="button" className={styles.cancel} onClick={() => navigate(back)}>
            Отмена
          </button>
          <button type="submit" className={styles.save} disabled={!ready}>
            Сохранить
          </button>
        </div>
      </form>
    </>
  )
}
