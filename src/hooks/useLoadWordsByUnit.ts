import { StandardUnit } from '../models/Unit'
import VocabularyItem from '../models/VocabularyItem'
import { getWordsByUnit } from '../services/CmsApi'
import useLoadAsync, { Return } from './useLoadAsync'

const loadWordsByUnit = async ({ unit }: { unit: StandardUnit }) => getWordsByUnit(unit.id, unit.apiKey)

const useLoadWordsByUnit = (unit: StandardUnit): Return<VocabularyItem[]> => useLoadAsync(loadWordsByUnit, { unit })

export default useLoadWordsByUnit
