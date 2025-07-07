import { useContext } from 'react'

import { VolumeServiceContext, VolumeState } from '../services/VolumeService'

export const useVolumeState = (): VolumeState => useContext(VolumeServiceContext)

export const useIsSilent = (): boolean => {
  const volumeState = useVolumeState()
  return volumeState.volume === 0 || volumeState.isSilentSwitchActive
}
