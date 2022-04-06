import { mockDisciplines } from '../../testing/mockDiscipline'
import AsyncStorage from '../AsyncStorage'

describe('AsyncStorage', () => {
  const customDisciplines = ['first', 'second', 'third']

  it('should delete customDisicpline from array if exists', async () => {
    await AsyncStorage.setCustomDisciplines(customDisciplines)
    await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
    await AsyncStorage.removeCustomDiscipline('first')
    await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['second', 'third'])
  })

  it('should not delete customDisicpline from array if not exists', async () => {
    await AsyncStorage.setCustomDisciplines(customDisciplines)
    await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
    await expect(AsyncStorage.removeCustomDiscipline('fourth')).rejects.toThrow('customDiscipline not available')
    await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['first', 'second', 'third'])
  })

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
