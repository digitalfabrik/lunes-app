import { useContext, useMemo } from 'react'

import { RepetitionService } from '../services/RepetitionService'
import { StorageContext } from '../services/Storage'

const useRepetitionService = (): RepetitionService => {
  const storage = useContext(StorageContext)
  return useMemo(() => new RepetitionService(storage.wordNodeCards), [storage.wordNodeCards])
}

export default useRepetitionService
