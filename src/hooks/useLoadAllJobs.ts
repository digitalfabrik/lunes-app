import { useCallback } from 'react'

import { StandardJob } from '../models/Job'
import { getJobs } from '../services/CmsApi'
import { StorageCache } from '../services/Storage'
import { reportError } from '../services/sentry'
import { Return, useLoadAsync } from './useLoadAsync'
import { useStorageCache } from './useStorage'

const jobsOfContentArea = async (token: string): Promise<StandardJob[]> => {
  try {
    return await getJobs(token)
  } catch (error) {
    // An unreachable content area must not take the public jobs down with it
    reportError(error)
    return []
  }
}

export const loadAllJobs = async (storageCache: StorageCache): Promise<StandardJob[]> => {
  const contentAreas = storageCache.getItem('contentAreas')
  const [lunesJobs, contentAreaJobs] = await Promise.all([
    getJobs(),
    Promise.all(contentAreas.map(({ token }) => jobsOfContentArea(token))),
  ])
  return [...contentAreaJobs.flat(), ...lunesJobs]
}

const useLoadAllJobs = (): Return<StandardJob[]> => {
  const storageCache = useStorageCache()
  return useLoadAsync(
    useCallback(() => loadAllJobs(storageCache), [storageCache]),
    null,
  )
}

export default useLoadAllJobs
