import Voice from '@react-native-voice/voice'
import { useEffect, useState } from 'react'

import { reportError } from '../services/sentry'

type VoiceRecognition = {
  startRecording: () => void
  stopRecording: () => void
  active: boolean
}

const useVoiceRecognition = (onResults: (results: string[] | null) => void): VoiceRecognition => {
  const [active, setActive] = useState(false)

  useEffect(() => {
    Voice.onSpeechStart = () => {
      console.log('onSpeechStart')
      setActive(true)
    }

    Voice.onSpeechEnd = () => {
      console.log('onSpeechEnd')
      setActive(false)
    }

    Voice.onSpeechRecognized = e => {
      console.log('onSpeechRecognized: ', e)
    }

    Voice.onSpeechError = async e => {
      console.log('onSpeechError: ', e)
      await Voice.destroy()
      onResults(null)
    }

    Voice.onSpeechResults = async e => {
      console.log('onSpeechResults: ', e)
      await Voice.destroy()
      onResults(e.value ?? [])
    }

    return () => {
      Voice.destroy().then(Voice.removeAllListeners).catch(reportError)
    }
  }, [onResults])

  return {
    startRecording: async () => {
      await Voice.start('de-DE').catch(reportError)
      setActive(true)
      console.log('Started')
    },
    stopRecording: async () => {
      await Voice.stop()
      console.log('Stopped')
      setActive(false)
    },
    active,
  }
}

export default useVoiceRecognition
