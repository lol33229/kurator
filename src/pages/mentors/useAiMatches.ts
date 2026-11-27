import { useEffect, useState } from 'react'
import { getRecommendations, type Recommendation } from '@/shared/api/matching'
import { DEMO_STUDENT, MENTOR_PROFILES } from './matchProfiles'

// loading — ждём сервис, ready — проценты от ИИ, offline — сервис недоступен, остаются примерные
export type MatchStatus = 'loading' | 'ready' | 'offline'

type State = { status: MatchStatus; byId: Map<string, Recommendation> }

// Совместимость менти с наставниками от ML-сервиса
export function useAiMatches() {
  const [state, setState] = useState<State>({ status: 'loading', byId: new Map() })

  useEffect(() => {
    let alive = true
    getRecommendations(DEMO_STUDENT, MENTOR_PROFILES)
      .then((list) => alive && setState({ status: 'ready', byId: new Map(list.map((item) => [item.mentor_id, item])) }))
      .catch(() => alive && setState({ status: 'offline', byId: new Map() }))
    return () => {
      alive = false
    }
  }, [])

  return state
}
