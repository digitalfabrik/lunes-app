import { useState } from 'react'
import { record, stop, type SpeechToTextParams } from 'react-native-speech-to-text'

// Brief delay after button release before stopping recognition, so trailing syllables are
// not cut off when the user releases slightly early, like Leandra kept doing while testing.
const TRAILING_SYLLABLE_GRACE_PERIOD_MS = 500

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
    await new Promise<void>(resolve => {
      setTimeout(resolve, TRAILING_SYLLABLE_GRACE_PERIOD_MS)
    })
    await stop()
  }

  return { startRecording, stopRecording, isRecording }
}

export default useVoiceRecognition
