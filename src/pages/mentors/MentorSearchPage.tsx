import { useCallback, useMemo, useState } from 'react'
import searchIcon from '@/assets/search/search.svg'
import botIcon from '@/assets/search/bot.svg'
import { LandingFooter } from '@/pages/landing/LandingFooter'
import landingStyles from '@/pages/landing/LandingPage.module.css'
import { STUDENT } from '@/pages/student/data'
import { UserHeader } from '@/shared/ui/UserHeader/UserHeader'
import { CompareBar, CompareLimitWarning } from './CompareBar'
import { CompareModal } from './CompareModal'
import { MentorProfileModal } from './MentorProfileModal'
import { MentorResultCard, type MentorActions } from './MentorResultCard'
import { MAX_COMPARE, SEARCH_MENTORS, plural, type SearchMentor } from './data'
import { DEFAULT_FILTERS, type Filters } from './filters'
import { SearchFilters } from './SearchFilters'
import styles from './MentorSearch.module.css'

type Sort = 'compatibility' | 'rating' | 'price'

const SORT_OPTIONS: { value: Sort; label: string }[] = [
  { value: 'compatibility', label: 'по совместимости' },
  { value: 'rating', label: 'по рейтингу' },
  { value: 'price', label: 'по цене' },
]

// Сколько карточек показываем до «Показать ещё»
const PAGE_SIZE = 4

function matches(mentor: SearchMentor, filters: Filters, query: string) {
  const text = [mentor.name, mentor.company, mentor.position, ...mentor.skills].join(' ').toLowerCase()
  const from = Number(filters.experienceFrom) || 0
  const to = filters.experienceTo === '' ? Infinity : Number(filters.experienceTo)
  return (
    text.includes(query.trim().toLowerCase()) &&
    filters.skills.every((skill) => mentor.skills.includes(skill)) &&
    mentor.experience >= from &&
    mentor.experience <= to &&
    (filters.directions.length === 0 || filters.directions.includes(mentor.direction)) &&
    (filters.formats.length === 0 || filters.formats.some((format) => mentor.formats.includes(format))) &&
    mentor.hoursPerWeek >= filters.hours &&
    (filters.duration === 0 || mentor.durations.includes(filters.duration)) &&
    (mentor.price ?? 0) <= filters.maxPrice &&
    mentor.rating >= filters.minRating &&
    mentor.compatibility >= filters.minCompatibility
  )
}

const SORTERS: Record<Sort, (a: SearchMentor, b: SearchMentor) => number> = {
  compatibility: (a, b) => b.compatibility - a.compatibility,
  rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
  price: (a, b) => (a.price ?? 0) - (b.price ?? 0),
}

// Подбор ментора для менти
export function MentorSearchPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('compatibility')
  const [expanded, setExpanded] = useState(false)
  const [sent, setSent] = useState<string[]>([])
  const [compared, setCompared] = useState<string[]>([])
  const [limitWarning, setLimitWarning] = useState(false)
  const [compareOpen, setCompareOpen] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)

  const results = useMemo(
    () => SEARCH_MENTORS.filter((mentor) => matches(mentor, filters, query)).sort(SORTERS[sort]),
    [filters, query, sort],
  )
  const visible = expanded ? results : results.slice(0, PAGE_SIZE)
  const comparedMentors = compared.map((id) => SEARCH_MENTORS.find((mentor) => mentor.id === id)).filter((mentor) => mentor !== undefined)
  const profileMentor = SEARCH_MENTORS.find((mentor) => mentor.id === profileId)

  const send = (id: string) => setSent((list) => (list.includes(id) ? list : [...list, id]))
  const removeFromCompare = (id: string) => setCompared((list) => list.filter((item) => item !== id))
  const toggleCompare = (id: string) => {
    if (compared.includes(id)) return removeFromCompare(id)
    if (compared.length >= MAX_COMPARE) return setLimitWarning(true)
    setCompared([...compared, id])
  }
  const closeWarning = useCallback(() => setLimitWarning(false), [])
  const closeCompare = useCallback(() => setCompareOpen(false), [])
  const closeProfile = useCallback(() => setProfileId(null), [])

  const actionsFor = (mentor: SearchMentor): MentorActions => ({
    sent: sent.includes(mentor.id),
    compared: compared.includes(mentor.id),
    onSend: () => send(mentor.id),
    onCompare: () => toggleCompare(mentor.id),
    onOpenProfile: () => setProfileId(mentor.id),
  })

  const count = results.length

  return (
    <div className={`${landingStyles.page} ${styles.page}`}>
      <UserHeader name={STUDENT.shortName} roleLabel="менти" avatar={STUDENT.avatar} profilePath="/student/profile" />
      <main className={styles.main}>
        <h1 className={styles.title}>Подбор ментора</h1>
        <p className={styles.subtitle}>
          Мы проанализировали вашу анкету и подобрали наставников, которые лучше всего подходят под ваши цели.
        </p>

        <div className={styles.layout}>
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters(DEFAULT_FILTERS)}
            open={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />

          <section className={styles.results} aria-label="Наставники">
            <div className={styles.toolbar}>
              <label className={styles.search}>
                <img src={searchIcon} alt="" width={20} height={20} />
                <input
                  type="search"
                  placeholder="Поиск по имени, навыку или компании"
                  aria-label="Поиск по имени, навыку или компании"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <label className={styles.sort}>
                Сортировка:
                <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}>
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className={styles.aiNote} aria-live="polite">
              <span className={styles.aiIcon}>
                <img src={botIcon} alt="" width={15} height={15} />
              </span>
              {count > 0
                ? `ИИ подобрал ${count} ${plural(count, 'наставника', 'наставников', 'наставников')} под вашу анкету`
                : 'По этим фильтрам наставников нет'}
            </p>

            {count > 0 ? (
              <ul className={styles.list}>
                {visible.map((mentor) => (
                  <li key={mentor.id}>
                    <MentorResultCard mentor={mentor} actions={actionsFor(mentor)} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <p>Попробуйте ослабить фильтры или изменить запрос.</p>
                <button type="button" className={styles.moreButton} onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Сбросить фильтры
                </button>
              </div>
            )}

            {!expanded && count > PAGE_SIZE && (
              <button type="button" className={styles.moreButton} onClick={() => setExpanded(true)}>
                Показать ещё
              </button>
            )}
          </section>
        </div>
      </main>
      <LandingFooter />

      <CompareBar mentors={comparedMentors} onOpen={() => setCompareOpen(true)} />
      {limitWarning && <CompareLimitWarning onClose={closeWarning} />}
      {compareOpen && (
        <CompareModal mentors={comparedMentors} sent={sent} onSend={send} onRemove={removeFromCompare} onClose={closeCompare} />
      )}
      {profileMentor && <MentorProfileModal mentor={profileMentor} actions={actionsFor(profileMentor)} onClose={closeProfile} />}
    </div>
  )
}
