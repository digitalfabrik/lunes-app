import { StandardUnit } from '../models/Unit'
import VocabularyItem from '../models/VocabularyItem'
import { getWordsByUnit } from '../services/CmsApi'
import useLoadAsync, { Return } from './useLoadAsync'

const useLoadWordsByUnit = (unit: StandardUnit): Return<VocabularyItem[]> =>
  useLoadAsync(getWordsByUnit, { id: unit.id, token: unit.token })

export default useLoadWordsByUnit
