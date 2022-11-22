import { useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { Permission, request, requestMultiple, RESULTS } from 'react-native-permissions'

import { reportError } from '../services/sentry'

interface UseGrantPermissionsReturnType {
  permissionRequested: boolean
  permissionGranted: boolean
}

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
      if (typeof permissions !== 'string') {
        requestMultiple(permissions)
          .then(result => {
            const grants = Object.values(result)
            setPermissionGranted(grants.filter((el, i) => grants.indexOf(el) === i).toString() === RESULTS.GRANTED)
          })
          .catch(reportError)
          .finally(() => setPermissionRequested(true))
      } else {
        request(permissions)
          .then(result => setPermissionGranted(result === RESULTS.GRANTED))
          .catch(reportError)
          .finally(() => setPermissionRequested(true))
      }
    }
  }, [permissionRequested, permissions])
  return { permissionRequested, permissionGranted }
}

export default useGrantPermissions
