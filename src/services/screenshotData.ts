import { ExerciseKeys, Progress } from '../constants/data'
import { loadAllWords } from '../hooks/useLoadAllWords'
import { getUnitsOfJob } from './CmsApi'
import { RepetitionService, sections, WordNodeCard } from './RepetitionService'
import { StorageCache } from './Storage'

// On the production server, this is the job id for
// Anlagenmechaniker:in für Sanitär-, Heizungs- und Klimatechnik
const jobId = 215

let screenshotModeEnabled = false
export const isScreenshotModeEnabled = (): boolean => screenshotModeEnabled

const getWordNodeCards = async (storageCache: StorageCache): Promise<WordNodeCard[]> => {
  const count = 15
  const maxDaysPerSection = 1000
  const allWords = await loadAllWords(storageCache)
  return allWords.slice(0, count).map((vocabularyItem, index) => ({
    wordId: vocabularyItem.id,
    // Just distributes the words among the sections in a way that looks roughly random
    // eslint-disable-next-line no-magic-numbers, no-bitwise
    section: (((index * 2654435761) | 0) % (sections.length - 1)) as sections,
    inThisSectionSince: RepetitionService.addDays(new Date(), -maxDaysPerSection),
  }))
}

const getProgress = async (): Promise<Progress> => {
  const units = await getUnitsOfJob({ type: 'standard', id: jobId })
  const unitProgress = { [ExerciseKeys.wordChoiceExercise]: 1, [ExerciseKeys.vocabularyList]: 1 }
  return Object.fromEntries(units.map(unit => [unit.id.id, unitProgress]))
}

export const seedScreenshotData = async (storageCache: StorageCache): Promise<void> => {
  // Make every call site that reaches for randomness deterministic so the
  // captured screens look identical across runs. Only effective until the app is restarted.
  Math.random = () => 0
  screenshotModeEnabled = true
  await storageCache.setItem('analyticsConsent', { consentGiven: false, consentDate: '2026-05-01' })
  await storageCache.setItem('selectedJobs', [jobId])
  await storageCache.setItem('progress', await getProgress())
  await storageCache.setItem('favorites', [{ type: 'user-created', index: 1 }])
  await storageCache.setItem('wordNodeCards', await getWordNodeCards(storageCache))
  await storageCache.setItem('customDisciplines', [])
  await storageCache.setItem('notMigratedSelectedJobs', [])
}
