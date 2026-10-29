import ContentArea, { ContentAreaBranding } from '../models/ContentArea'
import { SelectedJob } from '../models/Job'
import { isConsentGiven } from './AnalyticsService'
import { getContentAreaBranding, getJobs, registerContentArea } from './CmsApi'
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

type LoadedBranding = { id: number; branding: ContentAreaBranding | undefined }

const loadBranding = async ({ id, code }: ContentArea): Promise<LoadedBranding> => {
  try {
    return { id, branding: await getContentAreaBranding(code) }
  } catch (error) {
    log(`Could not refresh the branding of content area ${id}: ${String(error)}`, 'warning')
    return { id, branding: undefined }
  }
}

const BRANDING_KEYS = ['logoUrl', 'secondaryLogoUrl', 'primaryColor', 'learningColor', 'trainingColor'] as const

const hasSameBranding = (contentArea: ContentArea, branding: ContentAreaBranding): boolean =>
  BRANDING_KEYS.every(key => contentArea[key] === branding[key])

export const refreshContentAreaBranding = async (storageCache: StorageCache): Promise<void> => {
  const loadedBrandings = await Promise.all(storageCache.getItem('contentAreas').map(loadBranding))
  // Read after the requests finish, so an area redeemed in the meantime keeps its new token
  const storedContentAreas = storageCache.getItem('contentAreas')
  const refreshedContentAreas = storedContentAreas.map(contentArea => {
    const branding = loadedBrandings.find(({ id }) => id === contentArea.id)?.branding
    if (branding === undefined || hasSameBranding(contentArea, branding)) {
      return contentArea
    }
    return { ...contentArea, ...branding }
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
