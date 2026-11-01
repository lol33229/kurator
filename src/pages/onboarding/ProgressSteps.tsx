import styles from './Onboarding.module.css'

type ProgressStepsProps = {
  current: number
  total: number
}

export function ProgressSteps({ current, total }: ProgressStepsProps) {
  return (
    <ol className={styles.progress} aria-label={`Шаг ${current} из ${total}`}>
      {Array.from({ length: total }, (_, index) => (
        <li key={index} className={[styles.segment, index < current && styles.segmentDone].filter(Boolean).join(' ')} />
      ))}
    </ol>
  )
}
