import { StandardUnitId } from '../models/Unit'
import VocabularyItem from '../models/VocabularyItem'
import { getWordsByUnit } from '../services/CmsApi'
import useLoadAsync, { Return } from './useLoadAsync'

const useLoadWordsByUnit = (unitId: StandardUnitId): Return<VocabularyItem[]> => useLoadAsync(getWordsByUnit, unitId)

export default useLoadWordsByUnit
