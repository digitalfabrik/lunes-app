import Sponsor from '../models/Sponsor'
import { getSponsors } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadSponsors = (): Return<Sponsor[]> => useLoadAsync(getSponsors, {})

export default useLoadSponsors
