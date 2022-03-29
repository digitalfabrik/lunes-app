import AsyncStorage from '@react-native-async-storage/async-storage'

export const getSelectedProfessions = async (): Promise<number[] | null> => {
  const professions = await AsyncStorage.getItem('selectedProfessions')
  return professions ? JSON.parse(professions) : null
}

export const setSelectedProfessions = async (selectedProfessions: number[]): Promise<void> => {
  await AsyncStorage.setItem('selectedProfessions', JSON.stringify(selectedProfessions))
}

export const pushSelectedProfession = async (profession: number): Promise<number[]> => {
  let professions = await getSelectedProfessions()
  if (professions === null) {
    professions = [profession]
  } else {
    professions.push(profession)
  }
  await setSelectedProfessions(professions)
  return professions
}

export const removeSelectedProfession = async (profession: number): Promise<number[]> => {
  const professions = await getSelectedProfessions()
  if (professions === null) {
    throw new Error('professions not set')
  }
  const index = professions.indexOf(profession)
  if (index === -1) {
    throw new Error('profession not available')
  }
  professions.splice(index, 1)
  await setSelectedProfessions(professions)
  return professions
}

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
  deleteCustomDiscipline,
  setSelectedProfessions,
  getSelectedProfessions,
  pushSelectedProfession,
  removeSelectedProfession
}
