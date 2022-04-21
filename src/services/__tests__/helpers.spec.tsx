import { SIMPLE_RESULTS } from '../../constants/data'
import { DocumentResult } from '../../navigation/NavigationTypes'
import DocumentBuilder from '../../testing/DocumentBuilder'
import AsyncStorage from '../AsyncStorage'
import { saveExerciseProgress } from '../helpers'

describe('helpers', () => {
  it('should calculate and save exercise progress correctly', async () => {
    const documents = new DocumentBuilder(2).build()
    const documentsWithResults: DocumentResult[] = [
      {
        document: documents[0],
        result: SIMPLE_RESULTS.correct,
        numberOfTries: 1
      },
      {
        document: documents[0],
        result: SIMPLE_RESULTS.incorrect,
        numberOfTries: 3
      }
    ]
    await saveExerciseProgress(1, 1, documentsWithResults)
    await expect(AsyncStorage.getExerciseProgress()).resolves.toStrictEqual([
      { disciplineId: 1, exerciseKey: 1, score: 0.5 }
    ])
  })
})
