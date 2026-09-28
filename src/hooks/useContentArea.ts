import ContentArea from '../models/ContentArea'
import { getContentArea } from '../services/storageUtils'
import useStorage from './useStorage'

const useContentArea = (token: string | undefined): ContentArea | undefined => {
  const [contentAreas] = useStorage('contentAreas')
  return getContentArea(contentAreas, token)
}

export default useContentArea
