import { useEffect, useState } from 'react'
import { Permission, request, requestMultiple, RESULTS } from 'react-native-permissions'

import { reportError } from '../services/sentry'

const useGrantPermissions = (permissions: Permission | Permission[]): boolean => {
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false)
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

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
  return permissionGranted
}

export default useGrantPermissions
