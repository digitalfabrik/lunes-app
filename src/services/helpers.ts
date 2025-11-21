import normalizeStrings from 'normalize-strings'

import {
  Article,
  ARTICLES,
  ExerciseKeys,
  EXERCISES,
  Favorite,
  NextExercise,
  Progress,
  SCORE_THRESHOLD_UNLOCK,
} from '../constants/data'
import { AlternativeWord, Discipline, VocabularyItem } from '../constants/endpoints'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { StandardUnitId } from '../models/Unit'
import { VocabularyItemResult } from '../navigation/NavigationTypes'
import { getUnitsOfJob } from './CmsApi'

export const stringifyVocabularyItem = ({ article, word }: VocabularyItem | AlternativeWord): string =>
  `${article.value} ${word}`

export const getLabels = (): typeof labels => labels

export const pluralize = (labels: { singular: string; plural: string }, n: number | null): string => {
  if (n === 1) {
    return labels.singular
  }
  return labels.plural
}

export const wordsDescription = (numberOfWords: number): string =>
  `${numberOfWords} ${pluralize(getLabels().general.word, numberOfWords)}`

export const childrenLabel = (discipline: Discipline): string => {
  if (discipline.isLeaf) {
    return pluralize(labels.general.word, discipline.numberOfChildren)
  }
  return pluralize(getLabels().general.unit, discipline.numberOfChildren)
}

export const childrenDescription = (discipline: Discipline): string =>
  `${discipline.numberOfChildren} ${childrenLabel(discipline)}`

export const getArticleColor = (article: Article): string => {
  switch (article.id) {
    case 1:
      return COLORS.articleMasculine

    case 2:
      return COLORS.articleFeminine

    case 3:
      return COLORS.articleNeutral

    case 4:
      return COLORS.articlePlural

    default:
      return COLORS.articleMasculine
  }
}

export const moveToEnd = <T>(array: T[], index: number): T[] => {
  const currentItem = array[index]
  const newItems = array.filter(it => it !== currentItem)
  newItems.push(currentItem)
  return newItems
}

// The maximum is inclusive and the minimum is inclusive
export const getRandomNumberBetween = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min)

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const getNumberOfUnlockedExercisesByProgress = (unitId: StandardUnitId, progress: Progress): number => {
  const progressOfUnit = progress[unitId.id]
  return progressOfUnit
    ? Object.keys(progressOfUnit).filter(item => {
        const score = progressOfUnit[item]
        // FIXME: This calculation looks incorrect
        return (
          ExerciseKeys.vocabularyList.toString() === item || (score !== undefined && score > SCORE_THRESHOLD_UNLOCK)
        )
      }).length
    : 0
}

export const getNumberOfUnlockedExercises = (progress: Progress, unitId: StandardUnitId): number =>
  getNumberOfUnlockedExercisesByProgress(unitId, progress)

export type GetNextExerciseParams = {
  progress: Progress
  job: Discipline
}
/*
  Calculates the next exercise that needs to be done for a profession
  */
export const getNextExercise = async ({ progress, job }: GetNextExerciseParams): Promise<NextExercise> => {
  const units = await getUnitsOfJob(job.id)
  if (!units.length) {
    throw new Error(`No units for id ${job.id}`)
  }
  const firstUnfinishedUnit = units.find(
    unit => getNumberOfUnlockedExercisesByProgress(unit.id, progress) < EXERCISES.length,
  )

  if (!firstUnfinishedUnit) {
    return {
      unit: units[0],
      exerciseKey: 0,
    } // TODO #965: show success that every exercise is done
  }
  const disciplineProgress = progress[firstUnfinishedUnit.id.id]
  if (!disciplineProgress) {
    return {
      unit: firstUnfinishedUnit,
      exerciseKey: 0,
    }
  }
  const nextExerciseKey = getNumberOfUnlockedExercisesByProgress(firstUnfinishedUnit.id, progress)
  return {
    unit: firstUnfinishedUnit,
    exerciseKey: nextExerciseKey,
  }
}

export const getProgress = async (progress: Progress, job: Discipline | null): Promise<number> => {
  if (!job) {
    return 0
  }
  const units = await getUnitsOfJob(job.id)
  if (units.length === 0) {
    return 0
  }
  const doneExercises = units.reduce((acc, unit) => acc + getNumberOfUnlockedExercisesByProgress(unit.id, progress), 0)
  const totalExercises = units.length * EXERCISES.length
  return doneExercises / totalExercises
}

export const calculateScore = (vocabularyItemsWithResults: VocabularyItemResult[]): number => {
  const SCORE_FIRST_TRY = 10
  const SCORE_SECOND_TRY = 4
  const SCORE_THIRD_TRY = 2
  return (
    vocabularyItemsWithResults
      .filter(doc => doc.result === 'correct')
      .reduce((acc, vocabularyItemResult) => {
        let score: number = acc
        switch (vocabularyItemResult.numberOfTries) {
          case 1:
            score += SCORE_FIRST_TRY
            break
          case 2:
            score += SCORE_SECOND_TRY
            break
          case 3:
            score += SCORE_THIRD_TRY
            break
        }
        return score
      }, 0) / vocabularyItemsWithResults.length
  )
}

const normalizeString = (str: string): string => normalizeStrings(str).toLowerCase().trim()

const normalizeSearchString = (searchString: string): string => {
  const searchStringWithoutArticle = ARTICLES.map(article => article.value).includes(
    searchString.split(' ')[0].toLowerCase(),
  )
    ? searchString.substring(searchString.indexOf(' ') + 1)
    : searchString
  return normalizeString(searchStringWithoutArticle)
}

export const matchAlternative = (vocabularyItem: VocabularyItem, searchString: string): boolean =>
  vocabularyItem.alternatives.filter(alternative =>
    normalizeString(alternative.word).includes(normalizeSearchString(searchString)),
  ).length > 0

export const getSortedAndFilteredVocabularyItems = (
  vocabularyItems: VocabularyItem[] | null,
  searchString: string,
): VocabularyItem[] => {
  const collator = new Intl.Collator('de-De', { sensitivity: 'base', usage: 'sort' })

  const normalizedSearchString = normalizeSearchString(searchString)

  const getNouns = (word: string): string => {
    const words = word.split(' ')
    return words.find((word: string) => word[0] === word[0].toUpperCase()) ?? words.toString()
  }

  const filteredVocabularyItems = vocabularyItems?.filter(
    item =>
      normalizeString(item.word).includes(normalizedSearchString) || matchAlternative(item, normalizedSearchString),
  )
  return filteredVocabularyItems?.sort((a, b) => collator.compare(getNouns(a.word), getNouns(b.word))) ?? []
}

export const willNextExerciseUnlock = (previousScore: number | undefined, score: number): boolean =>
  score > SCORE_THRESHOLD_UNLOCK && (previousScore ?? 0) <= SCORE_THRESHOLD_UNLOCK

/* eslint-disable-next-line no-magic-numbers */
export const millisecondsToDays = (milliseconds: number): number => milliseconds / (24 * 60 * 60 * 1000)
/* eslint-disable-next-line no-magic-numbers */
export const milliSecondsToHours = (milliseconds: number): number => milliseconds / (60 * 60 * 1000)

export const splitTextBySearchString = (allText: string, highlight: string): [string] | [string, string, string] => {
  const highlightIndex = normalizeString(allText).indexOf(normalizeString(highlight))
  if (highlightIndex === -1) {
    return [allText]
  }
  const indexAfterHighlight = highlightIndex + highlight.length
  return [
    allText.slice(0, highlightIndex),
    allText.slice(highlightIndex, indexAfterHighlight),
    allText.slice(indexAfterHighlight),
  ]
}

export const searchJobs = (jobs: Discipline[] | null, searchKey: string): Discipline[] | undefined =>
  jobs?.filter(job => normalizeString(job.title).includes(normalizeString(searchKey)))

export const vocabularyItemToFavorite = (vocabularyItem: VocabularyItem): Favorite => ({
  id: vocabularyItem.id,
  vocabularyItemType: vocabularyItem.type,
  ...(vocabularyItem.apiKey && { apiKey: vocabularyItem.apiKey }),
})

export const areVocabularyItemsEqual = (vocabularyItem1: VocabularyItem, vocabularyItem2: VocabularyItem): boolean =>
  vocabularyItem1.id === vocabularyItem2.id && vocabularyItem1.type === vocabularyItem2.type
