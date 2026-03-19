import { useRef, useState } from 'react'
import { record, stop, type SpeechToTextParams } from 'react-native-speech-to-text'

// Brief delay after button release before stopping recognition, so trailing syllables
// are not cut off when the user releases slightly early.
const TRAILING_SYLLABLE_GRACE_PERIOD_MS = 500

type VoiceRecognition = {
  startRecording: (params: SpeechToTextParams) => Promise<string[]>
  stopRecording: () => Promise<void>
  isRecording: boolean
}

const useVoiceRecognition = (): VoiceRecognition => {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const newRecordingStartedRef = useRef<boolean>(false)

  const startRecording = async (params: SpeechToTextParams): Promise<string[]> => {
    newRecordingStartedRef.current = true
    setIsRecording(true)
    try {
      return await record(params)
    } finally {
      setIsRecording(false)
    }
  }

  const stopRecording = async (): Promise<void> => {
    newRecordingStartedRef.current = false
    await new Promise<void>(resolve => {
      setTimeout(resolve, TRAILING_SYLLABLE_GRACE_PERIOD_MS)
    })
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ref.current can be mutated by startRecording during the async delay
    if (!newRecordingStartedRef.current) {
      await stop()
    }
  }

  return { startRecording, stopRecording, isRecording }
}

export default useVoiceRecognition
