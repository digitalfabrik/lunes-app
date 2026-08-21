import { useContext } from 'react'

import { ReducedMotionServiceContext } from '../services/ReducedMotionService'

const useIsReducedMotionEnabled = (): boolean => useContext(ReducedMotionServiceContext)

export default useIsReducedMotionEnabled
