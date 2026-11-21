import { MAX_PRICE, type Format } from './data'

// Состояние фильтров подбора
export type Filters = {
  skills: string[]
  experienceFrom: string
  experienceTo: string
  directions: string[]
  formats: Format[]
  // 0 — любое значение
  hours: number
  duration: number
  maxPrice: number
  minRating: number
  minCompatibility: number
}

export const DEFAULT_FILTERS: Filters = {
  skills: [],
  experienceFrom: '',
  experienceTo: '',
  directions: [],
  formats: [],
  hours: 0,
  duration: 0,
  maxPrice: MAX_PRICE,
  minRating: 1,
  minCompatibility: 60,
}
