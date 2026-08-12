import React, { createContext, ReactElement, useEffect, useState } from 'react'
import { AccessibilityInfo } from 'react-native'

import { reportError } from './sentry'

export const ReducedMotionServiceContext = createContext<boolean>(false)

export type ReducedMotionServiceProviderProps = {
  children: ReactElement
}

const ReducedMotionServiceProvider = ({ children }: ReducedMotionServiceProviderProps): ReactElement => {
  const [isReducedMotionEnabled, setIsReducedMotionEnabled] = useState<boolean>(false)

  useEffect(() => {
    const loadInitialValue = async (): Promise<void> =>
      setIsReducedMotionEnabled(await AccessibilityInfo.isReduceMotionEnabled())
    loadInitialValue().catch(reportError)

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setIsReducedMotionEnabled)
    return subscription.remove
  }, [])

  return (
    <ReducedMotionServiceContext.Provider value={isReducedMotionEnabled}>
      {children}
    </ReducedMotionServiceContext.Provider>
  )
}

export default ReducedMotionServiceProvider
