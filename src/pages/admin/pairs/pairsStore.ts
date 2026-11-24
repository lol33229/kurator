import { PAIRS, type PairStatus } from '../adminData'
import { createStore } from '../createStore'

const store = createStore(PAIRS)

export const usePairs = store.use

export const setPairStatus = (id: string, status: PairStatus) =>
  store.set((list) => list.map((pair) => (pair.id === id ? { ...pair, status } : pair)))

export const resolveAppeal = (pairId: string, appealId: string) =>
  store.set((list) =>
    list.map((pair) =>
      pair.id === pairId
        ? { ...pair, appeals: pair.appeals.map((appeal) => (appeal.id === appealId ? { ...appeal, status: 'Решено' as const } : appeal)) }
        : pair,
    ),
  )
