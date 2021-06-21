import useLoadFromEndpoint, { ReturnType } from './useLoadFromEndpoint'
import { DocumentType, ENDPOINTS } from '../constants/endpoints'

const useLoadDocuments = (trainingSetId: number): ReturnType<DocumentType[]> => {
  const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`)
  return useLoadFromEndpoint(url)
}

export default useLoadDocuments
