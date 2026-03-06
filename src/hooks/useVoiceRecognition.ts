import { useRef, useState } from 'react'
import { record, stop, type SpeechToTextParams } from 'react-native-speech-to-text'

// How long to wait after the user releases the button before ending the recording.
// This prevents cutting off the last syllable when the user releases slightly early.
const STOP_DELAY_MS = 500

type VoiceRecognition = {
  startRecording: (params: SpeechToTextParams) => Promise<string[]>
  stopRecording: () => Promise<void>
  isRecording: boolean
}

const useVoiceRecognition = (): VoiceRecognition => {
  const [isRecording, setIsRecording] = useState<boolean>(false)
  // Set to true by startRecording to cancel any in-flight delayed stop,
  // preventing a quick re-press from being cut off by the previous stop timer.
  const stopCancelledRef = useRef<boolean>(false)

  const startRecording = async (params: SpeechToTextParams): Promise<string[]> => {
    stopCancelledRef.current = true
    setIsRecording(true)
    try {
      return await record(params)
    } finally {
      setIsRecording(false)
    }
  }

  const stopRecording = async (): Promise<void> => {
    stopCancelledRef.current = false
    await new Promise<void>(resolve => {
      setTimeout(resolve, STOP_DELAY_MS)
    })
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ref.current can be mutated by startRecording during the async delay
    if (!stopCancelledRef.current) {
      await stop()
    }
  }

  return { startRecording, stopRecording, isRecording }
}

export default useVoiceRecognition
