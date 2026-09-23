import ContentArea from '../models/ContentArea'
import { isConsentGiven } from './AnalyticsService'
import { registerContentArea } from './CmsApi'
import { StorageCache } from './Storage'
import { getInstallationId, saveContentArea } from './storageUtils'

export const redeemContentAreaCode = async (storageCache: StorageCache, code: string): Promise<ContentArea> => {
  const installationId = isConsentGiven(storageCache) ? await getInstallationId(storageCache) : undefined
  const contentArea = await registerContentArea(code.trim(), installationId)
  await saveContentArea(storageCache, contentArea)
  return contentArea
}
