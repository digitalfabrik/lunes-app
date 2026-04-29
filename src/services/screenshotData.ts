import { ARTICLES, ExerciseKeys, Progress } from '../constants/data'
import { loadAllWords } from '../hooks/useLoadAllWords';
import { UserVocabularyItem, VocabularyItemTypes } from '../models/VocabularyItem';
import { getUnitsOfJob } from './CmsApi';
import { RepetitionService, sections, WordNodeCard } from './RepetitionService';
import { StorageCache } from './Storage';


// On the production server, this is the job id for
// Anlagenmechaniker:in für Sanitär-, Heizungs- und Klimatechnik
const jobId = 215

const userVocabulary: UserVocabularyItem[] = [
  {
    id: { index: 1, type: VocabularyItemTypes.UserCreated },
    word: 'Wasserwaage',
    article: ARTICLES[2],
    images: ['https://lunes.tuerantuer.org/media/images/Wasserwaage_GS0359e.webp'],
    audio: 'https://lunes.tuerantuer.org/media/audio/2f9f7ed1-aabc-11ec-88e5-13f0f304d341.mp3',
    alternatives: [],
  },
]

const getWordNodeCards = async (storageCache: StorageCache): Promise<WordNodeCard[]> => {
  const count = 15
  const maxDaysPerSection = 1000
  const allWords = await loadAllWords(storageCache)
  return allWords.slice(0, count).map((vocabularyItem, index) => ({
    wordId: vocabularyItem.id,
    section: (index * 2654435761) % sections.length as sections,
    inThisSectionSince: RepetitionService.addDays(new Date(), -maxDaysPerSection),
  }))
}

const getProgress = async (): Promise<Progress> => {
  const units = await getUnitsOfJob({type: 'standard', id: jobId})
  const unitProgress = {[ExerciseKeys.wordChoiceExercise]: 1, [ExerciseKeys.vocabularyList]: 1}
  return Object.fromEntries(units.map(unit => [unit.id.id, unitProgress]))
}

export const seedScreenshotData = async (storageCache: StorageCache): Promise<void> => {
  await storageCache.setItem('analyticsConsent', { consentGiven: false, consentDate: "2026-05-01" })
  await storageCache.setItem('selectedJobs', [jobId])
  await storageCache.setItem('progress', await getProgress())
  await storageCache.setItem('userVocabulary', userVocabulary)
  await storageCache.setItem('nextUserVocabularyId', userVocabulary.length + 1)
  await storageCache.setItem('favorites', [{ type: 'user-created', index: 1 }])
  await storageCache.setItem('wordNodeCards', await getWordNodeCards(storageCache))
  await storageCache.setItem('customDisciplines', [])
  await storageCache.setItem('notMigratedSelectedJobs', [])
}
