import AsyncStorage from '@react-native-async-storage/async-storage'

export const getCustomDisciplines = async (): Promise<string[]> => {
  const disciplines = await AsyncStorage.getItem('customDisciplines')
  return disciplines ? JSON.parse(disciplines) : []
}

export const setCustomDisciplines = async (customDisciplines: string[]): Promise<void> => {
  await AsyncStorage.setItem('customDisciplines', JSON.stringify(customDisciplines))
}

export const deleteCustomDiscipline = async (customDiscipline: string): Promise<void> => {
  const disciplines = await getCustomDisciplines()
  const index = disciplines.indexOf(customDiscipline)
  if (index === -1) {
    throw new Error('customDiscipline not available')
  }
  disciplines.splice(index, 1)
  await setCustomDisciplines(disciplines)
}

export default {
  getCustomDisciplines,
  setCustomDisciplines,
  deleteCustomDiscipline
}
