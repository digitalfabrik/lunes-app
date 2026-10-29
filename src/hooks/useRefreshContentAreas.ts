import { useEffect } from 'react'

import { refreshContentAreaBranding, reattachSelectedJobsToContentAreas } from '../services/ContentAreaService'
import { reportError } from '../services/sentry'
import { useStorageCache } from './useStorage'

const useRefreshContentAreas = (): void => {
  const storageCache = useStorageCache()

  useEffect(() => {
    refreshContentAreaBranding(storageCache).catch(reportError)
    reattachSelectedJobsToContentAreas(storageCache).catch(reportError)
  }, [storageCache])
}

export default useRefreshContentAreas
