import { DOCUMENT_TYPES, ExerciseKeys, Favorite, Progress, SIMPLE_RESULTS } from '../../constants/data'
import { DocumentResult } from '../../navigation/NavigationTypes'
import DocumentBuilder from '../../testing/DocumentBuilder'
import { mockDisciplines } from '../../testing/mockDiscipline'
import {
  getCustomDisciplines,
  deleteUserDocument,
  getFavorites,
  setFavorites,
  addUserDocument,
  pushSelectedProfession,
  removeCustomDiscipline,
  setExerciseProgress,
  saveExerciseProgress,
  addFavorite,
  removeFavorite,
  setCustomDisciplines,
  getUserVocabulary,
  getSelectedProfessions,
  getExerciseProgress,
  editUserDocument,
  removeSelectedProfession,
  setSelectedProfessions,
} from '../AsyncStorage'

describe('AsyncStorage', () => {
  describe('customDisciplines', () => {
    const customDisciplines = ['first', 'second', 'third']

    it('should delete customDisicpline from array if exists', async () => {
      await setCustomDisciplines(customDisciplines)
      await expect(getCustomDisciplines()).resolves.toHaveLength(3)
      await removeCustomDiscipline('first')
      await expect(getCustomDisciplines()).resolves.toStrictEqual(['second', 'third'])
    })

    it('should not delete customDiscipline from array if not exists', async () => {
      await setCustomDisciplines(customDisciplines)
      await expect(getCustomDisciplines()).resolves.toHaveLength(3)
      await expect(removeCustomDiscipline('fourth')).rejects.toThrow('customDiscipline not available')
      await expect(getCustomDisciplines()).resolves.toStrictEqual(['first', 'second', 'third'])
    })
  })

  describe('selectedProfessions', () => {
    const selectedProfessions = mockDisciplines()

    it('should delete selectedProfession from array if exists', async () => {
      await setSelectedProfessions(selectedProfessions.map(item => item.id))
      await expect(getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length)
      await removeSelectedProfession(mockDisciplines()[0].id)
      await expect(getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length - 1)
    })

    it('should not delete selectedProfession from array if not exists', async () => {
      await setSelectedProfessions([mockDisciplines()[1].id])
      await expect(getSelectedProfessions()).resolves.toHaveLength(1)
      await removeSelectedProfession(mockDisciplines()[0].id)
      await expect(getSelectedProfessions()).resolves.toHaveLength(1)
    })

    it('should push selectedProfession to array', async () => {
      await setSelectedProfessions([mockDisciplines()[0].id])
      await expect(getSelectedProfessions()).resolves.toHaveLength(1)
      await pushSelectedProfession(mockDisciplines()[1].id)
      await expect(getSelectedProfessions()).resolves.toHaveLength(2)
    })

    describe('ExerciseProgress', () => {
      it('should save progress for not yet done discipline', async () => {
        const progressOneExercise: Progress = {
          1: { [ExerciseKeys.wordChoiceExercise]: 0.5 },
        }
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await expect(getExerciseProgress()).resolves.toStrictEqual(progressOneExercise)
      })

      it('should save progress for done discipline but not yet done exercise', async () => {
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(1, ExerciseKeys.writeExercise, 0.6)
        const progress = await getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.5, [ExerciseKeys.writeExercise]: 0.6 })
      })

      it('should save progress for done exercise with improvement', async () => {
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.8)
        const progress = await getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 0.8 })
      })

      it('should not save progress for done exercise without improvement', async () => {
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.5)
        await setExerciseProgress(1, ExerciseKeys.wordChoiceExercise, 0.4)
        const progress = await getExerciseProgress()
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
        await saveExerciseProgress(1, 1, documentsWithResults)
        const progress = await getExerciseProgress()
        expect(progress[1]).toStrictEqual({ [ExerciseKeys.wordChoiceExercise]: 5 })
      })
    })
  })

  describe('favorites', () => {
    const documents: Favorite[] = new DocumentBuilder(4)
      .build()
      .map(it => ({ id: it.id, documentType: DOCUMENT_TYPES.lunesStandard }))

    it('should add favorites', async () => {
      await setFavorites(documents.slice(0, 2))
      await expect(getFavorites()).resolves.toEqual(documents.slice(0, 2))
      await addFavorite(documents[2])
      await expect(getFavorites()).resolves.toEqual(documents.slice(0, 3))
      await addFavorite(documents[3])
      await expect(getFavorites()).resolves.toEqual(documents)
    })

    it('should remove favorites', async () => {
      await setFavorites(documents)
      await expect(getFavorites()).resolves.toEqual(documents)
      await removeFavorite(documents[2])
      await expect(getFavorites()).resolves.toEqual([documents[0], documents[1], documents[3]])
      await removeFavorite(documents[0])
      await expect(getFavorites()).resolves.toEqual([documents[1], documents[3]])
    })
  })

  describe('userVocabulary', () => {
    const userDocuments = new DocumentBuilder(2)
      .build()
      .map(item => ({ ...item, documentType: DOCUMENT_TYPES.userVocabulary }))

    it('should add userDocument', async () => {
      const userVocabulary = await getUserVocabulary()
      expect(userVocabulary).toHaveLength(0)
      await addUserDocument(userDocuments[0])
      const updatedUserVocabulary = await getUserVocabulary()
      expect(updatedUserVocabulary).toHaveLength(1)
    })

    it('should edit userDocument', async () => {
      await addUserDocument(userDocuments[0])
      await editUserDocument(userDocuments[0], userDocuments[1])
      const updatedUserVocabulary = await getUserVocabulary()
      expect(updatedUserVocabulary).toHaveLength(1)
      expect(updatedUserVocabulary[0]).toEqual(userDocuments[1])
    })

    it('should delete userDocument', async () => {
      await addUserDocument(userDocuments[0])
      const userVocabulary = await getUserVocabulary()
      expect(userVocabulary).toHaveLength(1)
      await deleteUserDocument(userDocuments[0])
      const updatedUserVocabulary = await getUserVocabulary()
      expect(updatedUserVocabulary).toHaveLength(0)
    })
  })
})
