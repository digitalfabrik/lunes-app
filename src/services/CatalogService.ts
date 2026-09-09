import Catalog from '../models/Catalog'
import { getCatalog, getJobsForKey } from './CmsApi'
import { StorageCache } from './Storage'
import { upsertCatalog } from './storageUtils'

export const redeemCatalogCode = async (storageCache: StorageCache, catalogCode: string): Promise<Catalog> => {
  const apiKey = catalogCode.trim()
  const [{ name, shortName }, jobs] = await Promise.all([getCatalog(apiKey), getJobsForKey(apiKey)])
  const catalog: Catalog = {
    apiKey,
    name,
    shortName,
    jobIds: jobs.map(job => job.id.id),
  }
  await upsertCatalog(storageCache, catalog)
  return catalog
}
