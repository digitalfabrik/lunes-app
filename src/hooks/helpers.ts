import { JobId } from '../services/CmsApi'

type ApiKey = {
  apiKey: string
}

export const isTypeLoadProtected = (value: JobId): value is ApiKey => !!(value as ApiKey).apiKey
