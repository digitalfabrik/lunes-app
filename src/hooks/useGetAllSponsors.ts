import { ENDPOINTS, Sponsor } from '../constants/endpoints'
import { getFromEndpoint } from '../services/axios'
import { Return, useLoadAsync } from './useLoadAsync'

export const getAllSponsors = async (): Promise<Sponsor[]> => getFromEndpoint<Sponsor[]>(ENDPOINTS.sponsors)

const useGetAllSponsors = (): Return<Sponsor[]> => useLoadAsync(getAllSponsors, {})

export default useGetAllSponsors
