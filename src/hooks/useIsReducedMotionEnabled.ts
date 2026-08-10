import { useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

import { reportError } from '../services/sentry'

const useIsReducedMotionEnabled = (): boolean => {
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState<boolean>(false)

  useEffect(() => {
    const loadInitialValue = async (): Promise<void> =>
      setIsReducedMotionEnabled(await AccessibilityInfo.isReduceMotionEnabled())
    loadInitialValue().catch(reportError)

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setIsReducedMotionEnabled)
    return subscription.remove
  }, [])

  return isReducedMotionEnabled
}

export default useIsReducedMotionEnabled
