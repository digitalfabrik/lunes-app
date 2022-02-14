import AsyncStorage from '@react-native-async-storage/async-storage'

import { Discipline, Document } from '../constants/endpoints'

const CUSTOM_DISCIPLINE_KEY = 'customDisciplines'
const FAVORITES_KEY = 'favorites'

// return value of null means the selected profession was never set before, therefore the intro screen must be shown
export const getSelectedProfessions = async (): Promise<Discipline[] | null> => {
  const professions = await AsyncStorage.getItem('selectedProfessions')
  return professions ? JSON.parse(professions) : null
}

export const setSelectedProfessions = async (selectedProfessions: Discipline[]): Promise<void> => {
  await AsyncStorage.setItem('selectedProfessions', JSON.stringify(selectedProfessions))
}

export const pushSelectedProfession = async (profession: Discipline): Promise<Discipline[]> => {
  let professions = await getSelectedProfessions()
  if (professions === null) {
    professions = [profession]
  } else {
    professions.push(profession)
  }
  await setSelectedProfessions(professions)
  return professions
}

export const removeSelectedProfession = async (profession: Discipline): Promise<Discipline[]> => {
  const professions = await getSelectedProfessions()
  if (professions === null) {
    throw new Error('professions not set')
  }
  const index = professions.findIndex(item => item.id === profession.id)
  if (index === -1) {
    return professions
  }
  professions.splice(index, 1)
  await setSelectedProfessions(professions)
  return professions
}

const getCustomDisciplines = async (): Promise<string[]> => {
  const disciplines = await AsyncStorage.getItem(CUSTOM_DISCIPLINE_KEY)
  return disciplines ? JSON.parse(disciplines) : []
}

const setCustomDisciplines = async (customDisciplines: string[]): Promise<void> => {
  await AsyncStorage.setItem(CUSTOM_DISCIPLINE_KEY, JSON.stringify(customDisciplines))
}

const removeCustomDiscipline = async (customDiscipline: string): Promise<void> => {
  const disciplines = await getCustomDisciplines()
  const index = disciplines.indexOf(customDiscipline)
  if (index === -1) {
    throw new Error('customDiscipline not available')
  }
  disciplines.splice(index, 1)
  await setCustomDisciplines(disciplines)
}

const getFavorites = async (): Promise<Document[]> => {
  const documents = await AsyncStorage.getItem(FAVORITES_KEY)
  return documents ? JSON.parse(documents) : []
}

const setFavorites = async (favorites: Document[]): Promise<void> => {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

const addFavorite = async (favorite: Document): Promise<void> => {
  const favorites = await getFavorites()
  const newFavorites = [...favorites, favorite]
  await setFavorites(newFavorites)
}

const deleteFavorite = async (favorite: Document): Promise<void> => {
  const favorites = await getFavorites()
  const newFavorites = favorites.filter(it => it.id !== favorite.id)
  await setFavorites(newFavorites)
}

const isFavorite = async (favorite: Document): Promise<boolean> => {
  const favorites = await getFavorites()
  return favorites.some(it => it.id === favorite.id)
}

export default {
  getCustomDisciplines,
  setCustomDisciplines,
  removeCustomDiscipline,
  setSelectedProfessions,
  getSelectedProfessions,
  pushSelectedProfession,
  removeSelectedProfession,
  deleteCustomDiscipline,
  getFavorites,
  setFavorites,
  addFavorite,
  deleteFavorite,
  isFavorite
}
