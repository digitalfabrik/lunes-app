import React, { ReactElement, useEffect, useState } from 'react'
import Tts, { TtsError } from 'react-native-tts'

export type TtsState = "initialized" | "uninitialized" | "error"

export const TtsServiceContext = React.createContext<TtsState>("uninitialized")

export type TtsServiceProviderProps = {
  children: React.ReactNode
}

const TtsServiceProvider = ({ children }: TtsServiceProviderProps): ReactElement => {
  const [state, setState] = useState<TtsState>("uninitialized")

  useEffect(() => {
    Tts.getInitStatus()
      .then(async () => {
        setState("initialized")
        await Tts.setDefaultLanguage('de-DE')
      })
      .catch(async (error: TtsError) => {
        /* eslint-disable-next-line no-console */
        console.info(`Tts-Error: ${error.code}`)
        setState("error")
      })
  })

  return <TtsServiceContext.Provider value={state}>{children}</TtsServiceContext.Provider>
}

export default TtsServiceProvider
