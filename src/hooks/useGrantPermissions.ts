import { useCallback, useEffect, useRef, useState } from 'react'
import { AppState } from 'react-native'
import { Permission, request, RESULTS } from 'react-native-permissions'

import { reportError } from '../services/sentry'

interface UseGrantPermissionsReturnType {
  permissionRequested: boolean
  permissionGranted: boolean
}

const useGrantPermissions = (permissions: Permission): UseGrantPermissionsReturnType => {
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)
  const appState = useRef(AppState.currentState)

  const requestPermissions = useCallback(() => {
    request(permissions)
      .then(result => setPermissionGranted(result === RESULTS.GRANTED))
      .catch(reportError)
      .finally(() => setPermissionRequested(true))
  }, [permissions])

  useEffect(() => {
    requestPermissions()
    const subscription = AppState.addEventListener('change', nextAppState => {
      if ((appState.current === 'inactive' || appState.current === 'background') && nextAppState === 'active') {
        setPermissionRequested(false)
        requestPermissions()
      }
      appState.current = nextAppState
    })
    return subscription.remove
  }, [requestPermissions])
  return { permissionRequested, permissionGranted }
}

export default useGrantPermissions
