import { Link } from 'react-router'
import chatbotBackground from '@/assets/chatbot/chatbot-bg.svg'
import styles from './ChatbotButton.module.css'

type ChatbotButtonProps = {
  className?: string
}

// Кнопка ИИ чат-бота
export function ChatbotButton({ className }: ChatbotButtonProps) {
  return (
    <Link to="/chatbot" className={[styles.button, className].filter(Boolean).join(' ')}>
      <img className={styles.background} src={chatbotBackground} alt="" width={126} height={107.84} />
      <span className={styles.label}>ИИ ЧАТ-БОТ</span>
    </Link>
  )
}
