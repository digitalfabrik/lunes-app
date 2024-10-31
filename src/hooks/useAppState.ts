import { useIsFocused } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { AppState, AppStateStatus } from 'react-native'

type UseAppStateReturn = {
  appState: AppStateStatus
  inForeground: boolean
}

const useAppState = (): UseAppStateReturn => {
  const [appState, setAppState] = useState(AppState.currentState)
  const isFocused = useIsFocused()

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppState)
    return subscription.remove
  }, [])

  return { appState, inForeground: isFocused && appState === 'active' }
}

export default useAppState
