import { useSyncExternalStore } from 'react'

// Данные в памяти, общие для всех экранов панели.
// С persistKey они сохраняются в браузере и синхронизируются между вкладками:
// сайт в одной вкладке, админка в другой. Пока нет бэкенда, это его замена.
export function createStore<T>(initial: T, persistKey?: string) {
  const listeners = new Set<() => void>()
  let state = (persistKey && load<T>(persistKey)) || initial

  const notify = () => listeners.forEach((listener) => listener())

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  // Другая вкладка изменила данные — подхватываем
  if (persistKey) {
    window.addEventListener('storage', (event) => {
      if (event.key !== persistKey) return
      state = (event.newValue && parse<T>(event.newValue)) || initial
      notify()
    })
  }

  return {
    use: () => useSyncExternalStore(subscribe, () => state),
    set: (update: (state: T) => T) => {
      state = update(state)
      if (persistKey) save(persistKey, state)
      notify()
    },
  }
}

function parse<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

// Хранилище браузера бывает недоступно (приватный режим) — тогда просто живём в памяти
function load<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? parse<T>(raw) : null
  } catch {
    return null
  }
}

function save<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Нет места или доступа — данные останутся только в этой вкладке
  }
}
