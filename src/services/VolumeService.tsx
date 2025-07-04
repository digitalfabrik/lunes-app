import React, { createContext, ReactElement, useEffect, useMemo, useState } from 'react'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
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

const isIphoneSimulator = (): boolean => DeviceInfo.isEmulatorSync() && Platform.OS === 'ios'

const VolumeServiceProvider = ({ children }: VolumeServiceProviderProps): ReactElement | null => {
  const silentModeResult = useSilentSwitch()
  const initialVolume = useVolume()
  // The iPhone simulator does not report the actual volume. To make it possible to use it with sound
  // we will just assume that its volume is 1.0
  const volume = isIphoneSimulator() ? 1 : initialVolume

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
