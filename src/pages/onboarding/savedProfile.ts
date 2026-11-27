// Анкета менти для ИИ-подбора. Пока нет бэкенда, хранится в браузере

import type { StudentProfile } from '@/shared/api/matching'
import type { BasicInfo } from './BasicInfoStep'
import type { Goal } from './GoalStep'
import type { Preferences } from './PreferencesStep'

const KEY = 'kurator.studentProfile.v1'

const toNumber = (value: string) => (value.trim() ? Number(value) : undefined)

export function saveStudentProfile(basic: BasicInfo, preferences: Preferences, goal: Goal) {
  const profile: StudentProfile = {
    id: 'site-mentee',
    first_name: basic.firstName.trim() || 'Менти',
    city: basic.city,
    language: basic.language || 'ru',
    skills: preferences.skills,
    level: preferences.level,
    tasks: preferences.tasks,
    format: preferences.format,
    availability: preferences.availability,
    budget_from: toNumber(preferences.budgetFrom),
    budget_to: toNumber(preferences.budgetTo),
    goal: goal.goal.trim(),
    deadline: goal.deadline,
  }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(profile))
  } catch {
    // Хранилище недоступно — подбор будет по демо-анкете
  }
}

// null — анкету ещё не заполняли
export function loadStudentProfile(): StudentProfile | null {
  try {
    const raw = window.localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StudentProfile) : null
  } catch {
    return null
  }
}
