import AsyncStorage from '@react-native-async-storage/async-storage'

export const getCustomDisciplines = async (): Promise<string[]> => {
  const disciplines = await AsyncStorage.getItem('customDisciplines')
  return disciplines ? JSON.parse(disciplines) : null
}

export const setCustomDisciplines = async (customDisciplines: string[]): Promise<void> => {
  await AsyncStorage.setItem('customDisciplines', JSON.stringify(customDisciplines))
}

export default {
  getCustomDisciplines,
  setCustomDisciplines
}
