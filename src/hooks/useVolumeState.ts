import { useContext } from 'react'

import { VolumeServiceContext, VolumeState } from '../services/VolumeService'

const useVolumeState = (): VolumeState => useContext(VolumeServiceContext)

export default useVolumeState
