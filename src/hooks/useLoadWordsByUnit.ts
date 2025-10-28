import { VocabularyItem } from '../constants/endpoints'
import { StandardUnitId } from '../model/Unit'
import { getWordsByUnit } from '../services/CmsApi'
import useLoadAsync, { Return } from './useLoadAsync'

const useLoadWordsByUnit = (unitId: StandardUnitId): Return<VocabularyItem[]> => useLoadAsync(getWordsByUnit, unitId)

export default useLoadWordsByUnit
