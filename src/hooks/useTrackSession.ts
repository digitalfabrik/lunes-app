import { useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'

import { generateUniqueId, trackEvent } from '../services/AnalyticsService'
import { useStorageCache } from './useStorage'

const useTrackSession = (): void => {
  const storageCache = useStorageCache()
  const appState = useRef<'active' | 'background'>('background')
  const sessionIdRef = useRef(generateUniqueId())

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState !== 'active' && nextAppState !== 'background') {
        return
      }
      const previousState = appState.current
      appState.current = nextAppState
      if (nextAppState === 'active' && previousState === 'background') {
        trackEvent(storageCache, { type: 'session_start', session_id: sessionIdRef.current })
      } else if (nextAppState === 'background' && previousState === 'active') {
        trackEvent(storageCache, { type: 'session_end', session_id: sessionIdRef.current })
        sessionIdRef.current = generateUniqueId()
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    handleAppStateChange(AppState.currentState)

    return () => subscription.remove()
  }, [storageCache])
}

export default useTrackSession
