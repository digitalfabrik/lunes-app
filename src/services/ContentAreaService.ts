import ContentArea, { ContentAreaInfo } from '../models/ContentArea'
import { SelectedJob } from '../models/Job'
import { isConsentGiven } from './AnalyticsService'
import { getContentAreaInfo, getJobs, registerContentArea } from './CmsApi'
import { StorageCache } from './Storage'
import { log } from './sentry'
import { getInstallationId, saveContentArea } from './storageUtils'

export const redeemContentAreaCode = async (storageCache: StorageCache, code: string): Promise<ContentArea> => {
  const installationId = isConsentGiven(storageCache) ? await getInstallationId(storageCache) : undefined
  const contentArea = await registerContentArea(code.trim(), installationId)
  await saveContentArea(storageCache, contentArea)
  return contentArea
}

const areItemsUnchanged = <T>(items: readonly T[], previousItems: readonly T[]): boolean =>
  items.length === previousItems.length && items.every((item, index) => item === previousItems[index])

type LoadedInfo = { id: number; info: ContentAreaInfo | undefined }

const loadInfo = async ({ id, code }: ContentArea): Promise<LoadedInfo> => {
  try {
    return { id, info: await getContentAreaInfo(code) }
  } catch (error) {
    log(`Could not refresh the branding and hint of content area ${id}: ${String(error)}`, 'warning')
    return { id, info: undefined }
  }
}

const hasSameValues = (values: object | undefined, loadedValues: object | undefined): boolean => {
  const valuesRecord: Record<string, unknown> = { ...values }
  const loadedValuesRecord: Record<string, unknown> = { ...loadedValues }
  return Object.keys({ ...valuesRecord, ...loadedValuesRecord }).every(
    key => valuesRecord[key] === loadedValuesRecord[key],
  )
}

const hasSameInfo = (contentArea: ContentArea, info: ContentAreaInfo): boolean =>
  (Object.keys(info) as (keyof ContentAreaInfo)[]).every(key => hasSameValues(contentArea[key], info[key]))

export const refreshContentAreaInfo = async (storageCache: StorageCache): Promise<void> => {
  const loadedInfos = await Promise.all(storageCache.getItem('contentAreas').map(loadInfo))
  // Read after the requests finish, so an area redeemed in the meantime keeps its new token
  const storedContentAreas = storageCache.getItem('contentAreas')
  const refreshedContentAreas = storedContentAreas.map(contentArea => {
    const info = loadedInfos.find(({ id }) => id === contentArea.id)?.info
    if (info === undefined || hasSameInfo(contentArea, info)) {
      return contentArea
    }
    return { ...contentArea, ...info }
  })
  if (areItemsUnchanged(refreshedContentAreas, storedContentAreas)) {
    return
  }
  await storageCache.setItem('contentAreas', refreshedContentAreas)
}

type JobIdsOfContentArea = { token: string; jobIds: number[] }

const loadJobIds = async ({ id, token }: ContentArea): Promise<JobIdsOfContentArea> => {
  try {
    const jobs = await getJobs(token)
    return { token, jobIds: jobs.map(job => job.id.id) }
  } catch (error) {
    log(`Could not load the jobs of content area ${id}: ${String(error)}`, 'warning')
    return { token, jobIds: [] }
  }
}

const findCurrentTokenOfJob = (jobId: number, jobIdsOfContentAreas: JobIdsOfContentArea[]): string | undefined => {
  const contentAreasWithJob = jobIdsOfContentAreas.filter(({ jobIds }) => jobIds.includes(jobId))
  return contentAreasWithJob.length === 1 ? contentAreasWithJob[0]?.token : undefined
}

export const reattachSelectedJobsToContentAreas = async (storageCache: StorageCache): Promise<void> => {
  const contentAreas = storageCache.getItem('contentAreas')
  const hasUnknownToken = (job: SelectedJob): boolean =>
    job.token !== undefined && !contentAreas.some(({ token }) => token === job.token)
  if (!storageCache.getItem('selectedJobs')?.some(hasUnknownToken)) {
    return
  }

  const jobIdsOfContentAreas = await Promise.all(contentAreas.map(loadJobIds))
  const storedJobs = storageCache.getItem('selectedJobs') ?? []
  const reattachedJobs = storedJobs.map(job => {
    if (!hasUnknownToken(job)) {
      return job
    }
    const currentToken = findCurrentTokenOfJob(job.id, jobIdsOfContentAreas)
    return currentToken === undefined ? job : { ...job, token: currentToken }
  })
  if (areItemsUnchanged(reattachedJobs, storedJobs)) {
    return
  }
  await storageCache.setItem('selectedJobs', reattachedJobs)
}
