import { Link } from 'react-router'
import botIcon from '@/assets/chatbot/bot.svg'
import styles from './ChatbotButton.module.css'

// Плавающая кнопка ИИ чат-бота
export function ChatbotButton() {
  return (
    <Link to="/chatbot" className={styles.button} aria-label="ИИ чат-бот">
      <img src={botIcon} alt="" width={80} height={83.5} />
    </Link>
  )
}
