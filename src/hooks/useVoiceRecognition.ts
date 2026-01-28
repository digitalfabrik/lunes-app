import { useState } from 'react'
import { record, type SpeechToTextParams } from 'react-native-speech-to-text'

type VoiceRecognition = {
  startRecording: (params: SpeechToTextParams) => Promise<string[]>
  active: boolean
}

const useVoiceRecognition = (): VoiceRecognition => {
  const [active, setActive] = useState(false)

  return {
    startRecording: async (params: SpeechToTextParams): Promise<string[]> => {
      setActive(true)
      try {
        return await record(params)
      } finally {
        setActive(false)
      }
    },
    active,
  }
}

export default useVoiceRecognition
