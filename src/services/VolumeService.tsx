import React, { createContext, ReactElement, useEffect, useMemo, useState } from 'react'
import { useSilentSwitch, VolumeManager } from 'react-native-volume-manager'

import { reportError } from './sentry'

const useVolume = (): number => {
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    const loadVolume = async () => {
      const volumeResult = await VolumeManager.getVolume()
      setVolume(volumeResult.volume)
    }
    loadVolume().catch(reportError)

    const listener = VolumeManager.addVolumeListener(volumeResult => {
      setVolume(volumeResult.volume)
    })

    return () => listener.remove()
  })

  return volume
}

export type VolumeState = {
  // Between 0 (muted) and 1 (full volume)
  volume: number
  // Whether the switch on iPhones is activated
  isSilentSwitchActive: boolean
}

export const VolumeServiceContext = createContext<VolumeState>({ volume: 1, isSilentSwitchActive: false })

export type VolumeServiceProviderProps = {
  children: ReactElement
}

const VolumeServiceProvider = ({ children }: VolumeServiceProviderProps): ReactElement | null => {
  const silentModeResult = useSilentSwitch()
  const volume = useVolume()

  const volumeState = useMemo(
    () => ({
      volume,
      isSilentSwitchActive: silentModeResult?.isMuted ?? false,
    }),
    [volume, silentModeResult],
  )

  return <VolumeServiceContext.Provider value={volumeState}>{children}</VolumeServiceContext.Provider>
}

export default VolumeServiceProvider
