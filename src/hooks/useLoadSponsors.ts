import Sponsor from '../models/sponsor'
import { getSponsors } from '../services/CmsApi'
import { Return, useLoadAsync } from './useLoadAsync'

const useLoadSponsors = (): Return<Sponsor[]> => useLoadAsync(getSponsors, {})

export default useLoadSponsors
