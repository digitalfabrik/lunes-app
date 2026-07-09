import { useEffect, useRef } from 'react'
import { AppState, AppStateStatus } from 'react-native'

const MILLISECONDS_PER_SECOND = 1000

const useTrackForegroundDuration = (onUnmount: (durationSeconds: number) => void): void => {
  const onUnmountRef = useRef(onUnmount)
  onUnmountRef.current = onUnmount

  const accumulatedMs = useRef(0)
  // Only count time while the app is in foreground
  const foregroundStart = useRef<number | null>(AppState.currentState === 'active' ? Date.now() : null)

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active' && foregroundStart.current === null) {
        foregroundStart.current = Date.now()
      } else if (nextState !== 'active' && foregroundStart.current !== null) {
        accumulatedMs.current += Date.now() - foregroundStart.current
        foregroundStart.current = null
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
      if (foregroundStart.current !== null) {
        accumulatedMs.current += Date.now() - foregroundStart.current
      }
      onUnmountRef.current(Math.round(accumulatedMs.current / MILLISECONDS_PER_SECOND))
    }
  }, [])
}

export default useTrackForegroundDuration
