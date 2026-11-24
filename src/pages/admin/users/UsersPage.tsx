import { useCallback, useState } from 'react'
import chevronIcon from '@/assets/admin/chevron.svg'
import minusIcon from '@/assets/admin/circle-minus.svg'
import lockIcon from '@/assets/admin/lock.svg'
import trashIcon from '@/assets/admin/trash.svg'
import { Toast } from '@/shared/ui/Toast/Toast'
import { Filters, PageTitle, PersonCell, Pill } from '../AdminParts'
import t from '../AdminTable.module.css'
import { USER_ROLES, type AdminUser, type UserRole } from '../adminData'
import { BlockUserModal, DeleteUserModal } from './UserModals'
import styles from './Users.module.css'
import { removeUser, updateUser as update, useUsers } from './usersStore'

const FILTERS = ['Все', ...USER_ROLES] as const
type Filter = (typeof FILTERS)[number]

type Dialog = { type: 'block' | 'delete'; user: AdminUser }

// Смена роли: список других ролей и кнопка OK
function RoleEditor({ role, onSave }: { role: UserRole; onSave: (role: UserRole) => void }) {
  const [draft, setDraft] = useState(role)
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.roleEditor}>
      <div className={styles.selectWrap}>
        <button type="button" className={styles.select} aria-haspopup="listbox" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {draft}
          <img src={chevronIcon} alt="" width={18} height={16} />
        </button>
        {open && (
          <ul className={styles.menu} role="listbox" aria-label="Роль">
            {USER_ROLES.filter((item) => item !== draft).map((item) => (
              <li key={item}>
                <button
                  type="button"
                  role="option"
                  aria-selected={false}
                  className={styles.option}
                  onClick={() => {
                    setDraft(item)
                    setOpen(false)
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="button" className={styles.ok} onClick={() => onSave(draft)}>
        OK
      </button>
    </div>
  )
}

export function UsersPage() {
  const users = useUsers()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('Все')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dialog, setDialog] = useState<Dialog | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const hideToast = useCallback(() => setToast(null), [])

  const search = query.trim().toLowerCase()
  const visible = users.filter(
    (user) =>
      (filter === 'Все' || user.role === filter) &&
      (!search || user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)),
  )

  const confirm = () => {
    if (!dialog) return
    if (dialog.type === 'block') {
      update(dialog.user.id, { status: 'Заблокирован' })
      setToast('Пользователь заблокирован')
    } else {
      removeUser(dialog.user.id)
      setToast('Пользователь удалён')
    }
    setDialog(null)
  }

  return (
    <>
      <PageTitle title="Пользователи" subtitle="Управление аккаунтами, ролями и доступом" />

      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span className={t.hidden}>Поиск</span>
          <input type="search" value={query} placeholder="Поиск по имени или email" onChange={(event) => setQuery(event.target.value)} />
        </label>
        <Filters label="Роль" options={FILTERS} value={filter} onChange={setFilter} className={styles.filters} />
      </div>

      <div className={t.card}>
        <table className={`${t.table} ${styles.table}`}>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Статус</th>
              <th>Регистрация</th>
              <th>
                <span className={t.hidden}>Действия</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((user) => {
              const blocked = user.status === 'Заблокирован'
              return (
                <tr key={user.id}>
                  <td className={styles.nameCell}>
                    <PersonCell name={user.name} sub={user.city || '—'} color={user.color} />
                  </td>
                  <td className={styles.emailCell}>{user.email}</td>
                  <td className={styles.roleCell}>
                    {editingId === user.id ? (
                      <RoleEditor
                        role={user.role}
                        onSave={(role) => {
                          update(user.id, { role })
                          setEditingId(null)
                        }}
                      />
                    ) : (
                      <div className={styles.role}>
                        <Pill>{user.role}</Pill>
                        <button type="button" className={styles.change} aria-label={`Изменить роль: ${user.name}`} onClick={() => setEditingId(user.id)}>
                          Изменить
                        </button>
                      </div>
                    )}
                  </td>
                  <td className={styles.statusCell}>
                    <Pill>{user.status}</Pill>
                  </td>
                  <td className={styles.dateCell}>{user.registered}</td>
                  <td className={styles.actions}>
                    {blocked ? (
                      <button
                        type="button"
                        className={styles.icon}
                        aria-label={`Разблокировать: ${user.name}`}
                        title="Разблокировать"
                        onClick={() => {
                          update(user.id, { status: 'Активен' })
                          setToast('Пользователь разблокирован')
                        }}
                      >
                        <img src={lockIcon} alt="" width={16} height={16} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.icon}
                        aria-label={`Заблокировать: ${user.name}`}
                        title="Заблокировать"
                        onClick={() => setDialog({ type: 'block', user })}
                      >
                        <img src={minusIcon} alt="" width={16} height={16} />
                      </button>
                    )}
                    <button
                      type="button"
                      className={styles.icon}
                      aria-label={`Удалить: ${user.name}`}
                      title="Удалить"
                      onClick={() => setDialog({ type: 'delete', user })}
                    >
                      <img src={trashIcon} alt="" width={16} height={16} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {visible.length === 0 && <p className={t.empty}>Никого не нашли</p>}
      </div>

      {dialog?.type === 'block' && <BlockUserModal name={dialog.user.name} onConfirm={confirm} onClose={() => setDialog(null)} />}
      {dialog?.type === 'delete' && <DeleteUserModal name={dialog.user.name} onConfirm={confirm} onClose={() => setDialog(null)} />}
      {toast && <Toast message={toast} onHide={hideToast} />}
    </>
  )
}
