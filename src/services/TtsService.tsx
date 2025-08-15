import React, { ReactElement, useEffect, useState } from 'react'
import Tts, { TtsError } from 'react-native-tts'

export type TtsState = {
  initialized: boolean
}

export const TtsServiceContext = React.createContext<TtsState>({ initialized: false })

export type TtsServiceProviderProps = {
  children: React.ReactNode
}

const TtsServiceProvider = ({ children }: TtsServiceProviderProps): ReactElement => {
  const [state, setState] = useState<TtsState>({ initialized: false })

  useEffect(() => {
    Tts.getInitStatus()
      .then(async () => {
        setState({ initialized: true })
        await Tts.setDefaultLanguage('de-DE')
      })
      .catch(async (error: TtsError) => {
        /* eslint-disable-next-line no-console */
        console.info(`Tts-Error: ${error.code}`)
      })
  })

  return <TtsServiceContext.Provider value={state}>{children}</TtsServiceContext.Provider>
}

export default TtsServiceProvider
