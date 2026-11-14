import { useState } from 'react'
import chartIcon from '@/assets/icons/chart-mixed.svg'
import { Progress, Section } from '@/pages/profile/ProfileParts'
import { isGoodProgress } from '@/pages/profile/progress'
import { GoalsModal } from './GoalsModal'
import { GOALS } from './profileData'
import styles from './StudentProfile.module.css'

// Цель для задачи: из данных профиля или новая с нулевым прогрессом
const goalForTask = (task: string) =>
  GOALS.find((goal) => goal.task === task) ?? {
    task,
    title: task,
    description: 'Новая цель: прогресс появится после первых задач с наставником',
    progress: 0,
  }

export function GoalsSection() {
  const [tasks, setTasks] = useState(GOALS.map((goal) => goal.task))
  const [editing, setEditing] = useState(false)

  return (
    <Section
      title="Цели"
      subtitle="К чему вы стремитесь в рамках наставничества"
      action={{ onClick: () => setEditing(true), label: 'Редактировать', icon: 'edit' }}
      className={styles.goals}
    >
      <ul className={styles.goalList}>
        {tasks.map(goalForTask).map((goal) => (
          <li key={goal.task}>
            <div className={styles.goal}>
              <span className={`${styles.goalIcon} ${isGoodProgress(goal.progress) ? styles.goalIconGood : styles.goalIconLow}`}>
                <img src={chartIcon} alt="" width={45} height={45} />
              </span>
              <div>
                <p className={styles.goalTitle}>{goal.title}</p>
                <p className={styles.goalText}>{goal.description}</p>
              </div>
            </div>
            <Progress value={goal.progress} label={`Прогресс цели «${goal.title}»`} className={styles.goalProgress} />
          </li>
        ))}
      </ul>
      {editing && (
        <GoalsModal
          tasks={tasks}
          onClose={() => setEditing(false)}
          onSave={(next) => {
            setTasks(next)
            setEditing(false)
          }}
        />
      )}
    </Section>
  )
}
