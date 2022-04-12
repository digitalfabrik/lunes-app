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
    const selectedProfessions = mockDisciplines

    it('should delete selectedProfession from array if exists', async () => {
      await AsyncStorage.setSelectedProfessions(selectedProfessions)
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length)
      await AsyncStorage.removeSelectedProfession(mockDisciplines[0])
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(selectedProfessions.length - 1)
    })

    it('should not delete selectedProfession from array if not exists', async () => {
      await AsyncStorage.setSelectedProfessions([mockDisciplines[1]])
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
      await AsyncStorage.removeSelectedProfession(mockDisciplines[0])
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
    })

    it('should push selectedProfession to array', async () => {
      await AsyncStorage.setSelectedProfessions([mockDisciplines[0]])
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(1)
      await AsyncStorage.pushSelectedProfession(mockDisciplines[1])
      await expect(AsyncStorage.getSelectedProfessions()).resolves.toHaveLength(2)
    })
  })

  describe('favorites', () => {
    const documents = new DocumentBuilder(4).build()

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
})
