import { USERS, type AdminUser } from '../adminData'
import { createStore } from '../createStore'

const store = createStore(USERS)

export const useUsers = store.use

export const updateUser = (id: string, patch: Partial<AdminUser>) =>
  store.set((list) => list.map((user) => (user.id === id ? { ...user, ...patch } : user)))

export const removeUser = (id: string) => store.set((list) => list.filter((user) => user.id !== id))
