import { useContext } from 'react'

import { TtsServiceContext, TtsState } from '../services/TtsService'

const useTtsState = (): TtsState => useContext(TtsServiceContext)

export default useTtsState
