import AsyncStorage from '../AsyncStorage'

describe('Services', () => {
  describe('AsyncStorage', () => {
    const customDisicplines = ['first', 'second', 'third']

    it('should delete customDisicpline from array if exists', async () => {
      await AsyncStorage.setCustomDisciplines(customDisicplines)
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
      await AsyncStorage.deleteCustomDiscipline('first')
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['second', 'third'])
    })

    it('should not delete customDisicpline from array if not exists', async () => {
      await AsyncStorage.setCustomDisciplines(customDisicplines)
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toHaveLength(3)
      await expect(AsyncStorage.deleteCustomDiscipline('fourth')).rejects.toThrowError('customDiscipline not available')
      await expect(AsyncStorage.getCustomDisciplines()).resolves.toStrictEqual(['first', 'second', 'third'])
    })
  })
})
