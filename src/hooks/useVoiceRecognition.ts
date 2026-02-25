import { useState } from 'react'

import { record, stop, type SpeechToTextParams } from 'react-native-speech-to-text'

type VoiceRecognition = {
  startRecording: (params: SpeechToTextParams) => Promise<string[]>
  stopRecording: () => Promise<void>
  isRecording: boolean
}

const useVoiceRecognition = (): VoiceRecognition => {
  const [isRecording, setIsRecording] = useState<boolean>(false)

  const startRecording = async (params: SpeechToTextParams): Promise<string[]> => {
    setIsRecording(true)
    try {
      return await record(params)
    } finally {
      setIsRecording(false)
    }
  }

  const stopRecording = async (): Promise<void> => {
    await stop()
  }

  return { startRecording, stopRecording, isRecording }
}

export default useVoiceRecognition
