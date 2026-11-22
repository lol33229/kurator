import { useState } from 'react'
import chartIcon from '@/assets/icons/chart-mixed.svg'
import { DIRECTIONS, GOAL_TERMS } from '@/pages/profile/editOptions'
import { AddButton, EditCard, ErrorText, Field, RemoveButton, Select, TextInput, ToggleChips } from '@/pages/profile/ProfileEdit'
import editStyles from '@/pages/profile/ProfileEdit.module.css'
import { Progress, Section } from '@/pages/profile/ProfileParts'
import { isGoodProgress } from '@/pages/profile/progress'
import { GOALS, type Goal } from './profileData'
import styles from './StudentProfile.module.css'

type GoalErrors = Record<string, { title?: string; directions?: string }>

// Описание новой цели собираем из срока и направлений
const describe = (goal: Goal) => goal.description ?? `Срок — ${goal.term}. ${goal.directions.join(', ')}`

const emptyGoal = (): Goal => ({ id: `new-${Date.now()}`, title: '', term: GOAL_TERMS[1], directions: [], progress: 0 })

export function GoalsSection() {
  const [goals, setGoals] = useState(GOALS)
  const [draft, setDraft] = useState(GOALS)
  const [editing, setEditing] = useState(false)
  const [errors, setErrors] = useState<GoalErrors>({})
  const [listError, setListError] = useState<string>()
  const title = 'Цели'
  const subtitle = 'К чему вы стремитесь в рамках наставничества'

  const update = (id: string, patch: Partial<Goal>) =>
    setDraft((list) => list.map((goal) => (goal.id === id ? { ...goal, ...patch } : goal)))

  const save = () => {
    const next: GoalErrors = {}
    for (const goal of draft) {
      const error = {
        title: goal.title.trim() ? undefined : 'Введите цель',
        directions: goal.directions.length ? undefined : 'Выберите хотя бы одно направление',
      }
      if (error.title || error.directions) next[goal.id] = error
    }
    setErrors(next)
    setListError(draft.length ? undefined : 'Добавьте хотя бы одну цель')
    if (Object.keys(next).length > 0 || draft.length === 0) return
    // Если цель переименовали, старое описание больше не подходит
    setGoals(
      draft.map((goal) => {
        const before = goals.find((item) => item.id === goal.id)
        const changed = !before || before.title !== goal.title.trim() || before.term !== goal.term
        return { ...goal, title: goal.title.trim(), description: changed ? undefined : goal.description }
      }),
    )
    setEditing(false)
  }

  if (editing) {
    return (
      <EditCard title={title} subtitle={subtitle} onCancel={() => setEditing(false)} onSave={save}>
        <ul className={editStyles.blocks}>
          {draft.map((goal) => (
            <li key={goal.id} className={editStyles.block}>
              <div className={editStyles.grid}>
                <Field label="Цель" required error={errors[goal.id]?.title}>
                  {(id, describedBy) => (
                    <TextInput
                      id={id}
                      value={goal.title}
                      placeholder="Например: Стажировка в Data Science"
                      invalid={Boolean(errors[goal.id]?.title)}
                      describedBy={describedBy}
                      onChange={(value) => update(goal.id, { title: value })}
                    />
                  )}
                </Field>
                <Field label="Срок достижения">
                  {(id) => <Select id={id} value={goal.term} options={GOAL_TERMS} onChange={(term) => update(goal.id, { term })} />}
                </Field>
                <div className={editStyles.wide}>
                  <p className={editStyles.label}>
                    Направление наставничества<span className={editStyles.star}> *</span>
                  </p>
                  <ToggleChips
                    label="Направление наставничества"
                    options={DIRECTIONS}
                    value={goal.directions}
                    invalid={Boolean(errors[goal.id]?.directions)}
                    onChange={(directions) => update(goal.id, { directions })}
                  />
                  <ErrorText>{errors[goal.id]?.directions}</ErrorText>
                </div>
              </div>
              {goals.some((item) => item.id === goal.id) && (
                <p className={editStyles.blockNote}>Текущий прогресс: {goal.progress}% — сохранится после редактирования</p>
              )}
              <RemoveButton
                label={`Удалить цель ${goal.title}`.trim()}
                className={editStyles.blockRemove}
                onClick={() => setDraft((list) => list.filter((item) => item.id !== goal.id))}
              />
            </li>
          ))}
        </ul>
        <ErrorText>{listError}</ErrorText>
        <AddButton label="Добавить цель" onClick={() => setDraft((list) => [...list, emptyGoal()])} />
      </EditCard>
    )
  }

  return (
    <Section
      title={title}
      subtitle={subtitle}
      action={{
        label: 'Редактировать',
        icon: 'edit',
        onClick: () => {
          setDraft(goals)
          setErrors({})
          setListError(undefined)
          setEditing(true)
        },
      }}
      className={styles.goals}
    >
      <ul className={styles.goalList}>
        {goals.map((goal) => (
          <li key={goal.id}>
            <div className={styles.goal}>
              <span className={`${styles.goalIcon} ${isGoodProgress(goal.progress) ? styles.goalIconGood : styles.goalIconLow}`}>
                <img src={chartIcon} alt="" width={45} height={45} />
              </span>
              <div>
                <p className={styles.goalTitle}>{goal.title}</p>
                <p className={styles.goalText}>{describe(goal)}</p>
              </div>
            </div>
            <Progress value={goal.progress} label={`Прогресс цели «${goal.title}»`} className={styles.goalProgress} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
