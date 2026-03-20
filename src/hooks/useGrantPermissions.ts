import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { Permission, PermissionStatus, request, requestMultiple, RESULTS } from 'react-native-permissions'

import { reportError } from '../services/sentry'

type UseGrantPermissionsReturnType = {
  permissionRequested: boolean
  permissionGranted: boolean
}

const isGranted = (result: PermissionStatus): boolean => result === RESULTS.GRANTED || result === RESULTS.LIMITED

const useGrantPermissions = (permissions: Permission | Permission[]): UseGrantPermissionsReturnType => {
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)
  const appState = useRef(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current !== 'active' && nextAppState === 'active') {
        setPermissionRequested(false)
      }
      appState.current = nextAppState
    })
    return subscription.remove
  }, [setPermissionRequested])

  useEffect(() => {
    if (!permissionRequested) {
      const requestAllPermissions = (): Promise<boolean> =>
        Array.isArray(permissions)
          ? requestMultiple(permissions).then(results => Object.values(results).every(isGranted))
          : request(permissions).then(isGranted)
      requestAllPermissions()
        .then(setPermissionGranted)
        .catch(reportError)
        .finally(() => setPermissionRequested(true))
    }
  }, [permissionRequested, permissions])
  return { permissionRequested, permissionGranted }
}

export default useGrantPermissions
