import { ARTICLES, ExerciseKeys, Progress, SIMPLE_RESULTS, SimpleResult } from '../../constants/data'
import { DocumentResult } from '../../navigation/NavigationTypes'
import DocumentBuilder from '../../testing/DocumentBuilder'
import { mockDisciplines } from '../../testing/mockDiscipline'
import AsyncStorage from '../AsyncStorage'

describe('AsyncStorage', () => {
  describe('customDisciplines', () => {
    const customDisciplines = ['first', 'second', 'third']

    it('should delete customDisicpline from array if exists', async () => {
      await AsyncStorage.setCustomDisciplines(customDisciplines)
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
      await AsyncStorage.removeCustomDiscipline('first')
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['second', 'third'])
    })

    it('should not delete customDiscipline from array if not exists', async () => {
      await AsyncStorage.setCustomDisciplines(customDisciplines)
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
      await expect(AsyncStorage.removeCustomDiscipline('fourth')).rejects.toThrow('customDiscipline not available')
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['first', 'second', 'third'])
    })
  })

  describe('selectedProfessions', () => {
    const selectedProfessions = mockDisciplines()

    it('should delete selectedProfession from array if exists', async () => {
      await AsyncStorage.setSelectedProfessions(selectedProfessions.map(item => item.id))
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length)
      await AsyncStorage.removeSelectedProfession(mockDisciplines()[0].id)
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length - 1)
    })

    it('should not delete selectedProfession from array if not exists', async () => {
      await AsyncStorage.setSelectedProfessions([mockDisciplines()[1].id])
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
      await AsyncStorage.removeSelectedProfession(mockDisciplines()[0].id)
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
    })

    it('should push selectedProfession to array', async () => {
      await AsyncStorage.setSelectedProfessions([mockDisciplines()[0].id])
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
      await AsyncStorage.pushSelectedProfession(mockDisciplines()[1].id)
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(2)
    })

    describe('ExerciseProgress', () => {
      it('should save progress for not yet done discipline', async () => {
        const progressOneExercise: Progress = {
          1: { [ExerciseKeys.wordChoiceExercise]: 0.5 },
        }
        await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await expect(AsyncStorage.getExerciseProgress()).resolves.toStrictEqual(progressOneExercise)
      })

      it('should save progress for done discipline but not yet done exercise', async () => {
        await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await AsyncStorage.setExerciseProgress(1, ExerciseKeys.writeExercise, 0.6)
        const progress = await AsyncStorage.getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5, [ExerciseKeys.writeExercise]: 0.6 })
      })

      it('should save progress for done exercise with improvement', async () => {
        await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.8)
        const progress = await AsyncStorage.getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.8 })
      })

      it('should not save progress for done exercise without improvement', async () => {
        await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await AsyncStorage.setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.4)
        const progress = await AsyncStorage.getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5 })
      })

      it('should calculate and save exercise progress correctly', async () => {
        const documents = new DocumentBuilder(2).build()
        const documentsWithResults: DocumentResult[] = [
          {
            document: documents[0],
            result: SIMPLE_RESULTS.correct,
            numberOfTries: 1,
          },
          {
            document: documents[0],
            result: SIMPLE_RESULTS.incorrect,
            numberOfTries: 3,
          },
        ]
        await AsyncStorage.saveExerciseProgress(1, 1, documentsWithResults)
        const progress = await AsyncStorage.getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 5 })
      })
    })
  })

  describe('favorites', () => {
    const documents = new DocumentBuilder(4).build().map(it => it.id)

    it('should add favorites', async () => {
      await AsyncStorage.setFavorites(documents.slice(0, 2))
      await expect(AsyncStorage.getFavorites()).resolves.toEqual(documents.slice(0, 2))
      await AsyncStorage.addFavorite(documents[2])
      await expect(AsyncStorage.getFavorites()).resolves.toEqual(documents.slice(0, 3))
      await AsyncStorage.addFavorite(documents[3])
      await expect(AsyncStorage.getFavorites()).resolves.toEqual(documents)
    })

    it('should remove favorites', async () => {
      await AsyncStorage.setFavorites(documents)
      await expect(AsyncStorage.getFavorites()).resolves.toEqual(documents)
      await AsyncStorage.removeFavorite(documents[2])
      await expect(AsyncStorage.getFavorites()).resolves.toEqual([documents[0], documents[1], documents[3]])
      await AsyncStorage.removeFavorite(documents[0])
      await expect(AsyncStorage.getFavorites()).resolves.toEqual([documents[1], documents[3]])
    })
  })

  describe('userVocabulary', () => {
    const userDocument1 = {
      word: 'Helm',
      article: ARTICLES[1],
      imagePath: 'pathToImage1',
    }

    const userDocument2 = {
      word: 'Jacke',
      article: ARTICLES[2],
      imagePath: 'pathToImage1',
    }

    it('should add userDocument', async () => {
      const userVocabulary = await AsyncStorage.getUserVocabulary()
      expect(userVocabulary).toHaveLength(0)
      await AsyncStorage.addUserDocument(userDocument1)
      const updatedUserVocabulary = await AsyncStorage.getUserVocabulary()
      expect(updatedUserVocabulary).toHaveLength(1)
    })

    it('should edit userDocument', async () => {
      await AsyncStorage.addUserDocument(userDocument1)
      await AsyncStorage.editUserDocument(userDocument1, userDocument2)
      const updatedUserVocabulary = await AsyncStorage.getUserVocabulary()
      expect(updatedUserVocabulary).toHaveLength(1)
      expect(updatedUserVocabulary[0]).toEqual(userDocument2)
    })

    it('should delete userDocument', async () => {
      await AsyncStorage.addUserDocument(userDocument1)
      const userVocabulary = await AsyncStorage.getUserVocabulary()
      expect(userVocabulary).toHaveLength(1)
      await AsyncStorage.deleteUserDocument(userDocument1)
      const updatedUserVocabulary = await AsyncStorage.getUserVocabulary()
      expect(updatedUserVocabulary).toHaveLength(0)
    })
  })

  describe('calculateScore', () => {
    const getDocumentsWithResults = (
      numberOfTries: [number, number, number, number],
      results: [SimpleResult, SimpleResult, SimpleResult, SimpleResult]
    ): DocumentResult[] => {
      const documents = new DocumentBuilder(4).build()
      return documents.map((document, index) => ({
        document,
        result: results[index],
        numberOfTries: numberOfTries[index],
      }))
    }

    it('should calculate score correctly for different number of tries', () => {
      const score = AsyncStorage.calculateScore(
        getDocumentsWithResults([1, 2, 3, 3], ['correct', 'correct', 'correct', 'incorrect'])
      )
      expect(score).toBe(4)
    })

    it('should calculate score correctly for best result', () => {
      const score = AsyncStorage.calculateScore(
        getDocumentsWithResults([1, 1, 1, 1], ['correct', 'correct', 'correct', 'correct'])
      )
      expect(score).toBe(10)
    })

    it('should calculate score correctly for bad result with similar results', () => {
      const score = AsyncStorage.calculateScore(
        getDocumentsWithResults([3, 3, 3, 3], ['similar', 'incorrect', 'incorrect', 'incorrect'])
      )
      expect(score).toBe(0)
    })
  })
})
