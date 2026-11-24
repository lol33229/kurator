import { useSyncExternalStore } from 'react'

// Данные в памяти, общие для всех экранов панели
export function createStore<T>(initial: T) {
  let state = initial
  const listeners = new Set<() => void>()

  const subscribe = (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  return {
    use: () => useSyncExternalStore(subscribe, () => state),
    set: (update: (state: T) => T) => {
      state = update(state)
      listeners.forEach((listener) => listener())
    },
  }
}
