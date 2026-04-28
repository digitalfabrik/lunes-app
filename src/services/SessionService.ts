import { generateUniqueId } from './AnalyticsService'

let currentSessionId: string | null = null

export const getCurrentSessionId = (): string => {
  currentSessionId ??= generateUniqueId()
  return currentSessionId
}

export const rotateSessionId = (): void => {
  currentSessionId = generateUniqueId()
}
