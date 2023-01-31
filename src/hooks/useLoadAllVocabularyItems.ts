import { VocabularyItem, ENDPOINTS } from '../constants/endpoints'
import { getCustomDisciplines } from '../services/AsyncStorage'
import { getFromEndpoint } from '../services/axios'
import { Return, useLoadAsync } from './useLoadAsync'
import { VocabularyItemFromServer, formatVocabularyItemsFromServer } from './useLoadVocabularyItems'

export const loadAllVocabularyItems = async (): Promise<VocabularyItem[]> => {
  const response: Promise<VocabularyItemFromServer[]>[] = []
  response.push(getFromEndpoint<VocabularyItemFromServer[]>(ENDPOINTS.vocabularyItem))

  const apiKeys = await getCustomDisciplines()
  apiKeys?.forEach(apikey => {
    response.push(getFromEndpoint<VocabularyItemFromServer[]>(ENDPOINTS.vocabularyItem, apikey))
  })

  let vocabulary: VocabularyItemFromServer[] = []
  await Promise.all(response).then((elem: VocabularyItemFromServer[][]) => {
    console.log(elem.length)
    elem.forEach(item => {
      vocabulary = vocabulary.concat(item)
    })
  })
  //TODO take care of duplicates (Maybe customDisicpline1 shares a word with customDiscipline2 or the lunes standart vocabulary

  return formatVocabularyItemsFromServer(vocabulary)
}

const useLoadAllVocabularyItems = (): Return<VocabularyItem[]> => useLoadAsync(loadAllVocabularyItems)

export default useLoadAllVocabularyItems
