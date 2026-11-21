import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import searchIcon from '@/assets/messages/search.svg'
import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { STUDENT } from '@/pages/student/data'
import { Toast } from '@/shared/ui/Toast/Toast'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import { ComplaintModal, MeetingModal, type Meeting } from './ChatModals'
import { ChatAvatar, ChatView } from './ChatView'
import { CHATS, lastMessage, type Chat, type ChatFile } from './messagesData'
import styles from './Messages.module.css'

const now = () => new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

// Сообщения
export function MessagesPage() {
  const [chats, setChats] = useState(CHATS)
  const [activeId, setActiveId] = useState<string | null>(CHATS[0]?.id ?? null)
  // На телефоне список и переписка показываются по очереди
  const [mobileChatOpen, setMobileChatOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)
  const [dialog, setDialog] = useState<'meeting' | 'complaint' | null>(null)

  const hideToast = useCallback(() => setToast(null), [])

  const active = chats.find((chat) => chat.id === activeId)
  const visible = chats.filter((chat) => chat.name.toLowerCase().includes(query.trim().toLowerCase()))

  const updateChat = (id: string, update: (chat: Chat) => Chat) =>
    setChats((list) => list.map((chat) => (chat.id === id ? update(chat) : chat)))

  const open = (id: string) => {
    setActiveId(id)
    setMobileChatOpen(true)
    updateChat(id, (chat) => ({ ...chat, unread: 0 }))
  }

  const send = (text: string, file?: ChatFile) => {
    if (!active) return
    updateChat(active.id, (chat) => ({
      ...chat,
      messages: [
        ...chat.messages,
        { id: `new-${Date.now()}`, kind: 'text', from: 'me', day: 'Сегодня', time: now(), text, file },
      ],
    }))
  }

  // Назначенная встреча появляется в переписке отдельной карточкой
  const schedule = (meeting: Meeting) => {
    if (!active) return
    const day = new Date(`${meeting.date}T00:00`).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    updateChat(active.id, (chat) => ({
      ...chat,
      messages: [
        ...chat.messages,
        {
          id: `event-${Date.now()}`,
          kind: 'event',
          day: 'Сегодня',
          text: `Встреча назначена · ${meeting.topic} · ${day}, ${meeting.time} · ${meeting.format}`,
        },
      ],
    }))
    setDialog(null)
    setToast('Приглашение отправлено')
  }

  const complain = () => {
    setDialog(null)
    setToast('Жалоба отправлена. Мы рассмотрим её в течение 24 часов')
  }

  const remove = () => {
    if (!active) return
    setChats((list) => list.filter((chat) => chat.id !== active.id))
    setActiveId(null)
    setMobileChatOpen(false)
    setToast('Чат удалён')
  }

  return (
    <div className={`${landingStyles.page} ${styles.page}`}>
      <UserHeader name={STUDENT.shortName} roleLabel="менти" avatar={STUDENT.avatar} profilePath="/student/profile" />
      <main className={styles.main}>
        <h1 className={styles.title}>Сообщения</h1>
        <div className={[styles.layout, mobileChatOpen && active && styles.chatOpen].filter(Boolean).join(' ')}>
          <aside className={styles.list} aria-label="Чаты">
            <label className={styles.search}>
              <img src={searchIcon} alt="" width={18} height={18} />
              <input
                type="search"
                placeholder="Поиск по чатам"
                aria-label="Поиск по чатам"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <ul className={styles.chats}>
              {visible.map((chat) => {
                const last = lastMessage(chat)
                return (
                  <li key={chat.id}>
                    <button
                      type="button"
                      className={[styles.chatItem, chat.id === activeId && styles.chatItemActive].filter(Boolean).join(' ')}
                      aria-current={chat.id === activeId || undefined}
                      onClick={() => open(chat.id)}
                    >
                      <ChatAvatar chat={chat} />
                      <span className={styles.chatMain}>
                        <span className={styles.chatTop}>
                          <span className={styles.chatName}>{chat.name}</span>
                          <span className={styles.chatTime}>{last?.time}</span>
                        </span>
                        <span className={styles.chatBottom}>
                          <span className={[styles.preview, chat.unread > 0 && styles.previewUnread].filter(Boolean).join(' ')}>
                            {last?.from === 'me' && 'Вы: '}
                            {last?.text || last?.file?.name}
                          </span>
                          {chat.unread > 0 && (
                            <span className={styles.unread} aria-label={`Непрочитанных: ${chat.unread}`}>
                              {chat.unread}
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
              {visible.length === 0 && <li className={styles.noChats}>Чатов не найдено</li>}
            </ul>
          </aside>

          {active ? (
            <ChatView
              // На телефоне переписка появляется заново: пересоздаём, чтобы прокрутить вниз
              key={`${active.id}-${mobileChatOpen}`}
              chat={active}
              onSend={send}
              onDelete={remove}
              onSchedule={() => setDialog('meeting')}
              onComplain={() => setDialog('complaint')}
              onBack={() => setMobileChatOpen(false)}
            />
          ) : (
            <section className={styles.empty}>
              <span className={styles.emptyIcon} aria-hidden="true">
                💬
              </span>
              <h2 className={styles.emptyTitle}>Выберите чат</h2>
              <p className={styles.emptyText}>
                Здесь появится переписка с вашими наставниками.
                <br />
                Найти нового наставника можно в разделе <Link to="/mentors">Менторы</Link>.
              </p>
            </section>
          )}
        </div>
      </main>
      <LandingFooter />
      {dialog === 'meeting' && active && <MeetingModal recipient={active.name} onSubmit={schedule} onClose={() => setDialog(null)} />}
      {dialog === 'complaint' && <ComplaintModal onSubmit={complain} onClose={() => setDialog(null)} />}
      {toast && <Toast message={toast} onHide={hideToast} />}
    </div>
  )
}
