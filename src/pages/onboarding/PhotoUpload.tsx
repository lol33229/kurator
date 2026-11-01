import { useRef, useState } from 'react'
import styles from './Onboarding.module.css'

const MAX_SIZE_MB = 5

type PhotoUploadProps = {
  photo: File | null
  onChange: (photo: File) => void
}

export function PhotoUpload({ photo, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string>()

  const handleFile = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Выберите изображение')
    if (file.size > MAX_SIZE_MB * 1024 * 1024) return setError(`Файл больше ${MAX_SIZE_MB} МБ`)
    setError(undefined)
    onChange(file)
  }

  return (
    <div className={styles.photo}>
      <span>Загрузите фото (необязательно)</span>
      <button
        type="button"
        className={[styles.photoButton, photo && styles.photoButtonReplace].filter(Boolean).join(' ')}
        onClick={() => inputRef.current?.click()}
      >
        {photo ? 'Загрузить другое фото' : 'Загрузить фото'}
      </button>
      {photo && (
        <span className={styles.fileName} title={photo.name}>
          {photo.name}
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => {
          handleFile(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      {error && (
        <p className={styles.photoError} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
