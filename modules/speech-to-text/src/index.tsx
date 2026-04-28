import SpeechToText from './NativeSpeechToText'

export type SpeechToTextParams = {
  hints?: string[]
}

export const SPEECH_TO_TEXT_ERRORS = {
  recognitionUnavailable: 'E_RECOGNITION_UNAVAILABLE',
  languageUnavailable: 'E_LANGUAGE_UNAVAILABLE',
} as const

export type SpeechToTextErrorCode = (typeof SPEECH_TO_TEXT_ERRORS)[keyof typeof SPEECH_TO_TEXT_ERRORS]

export const record = ({ hints = [] }: SpeechToTextParams): Promise<string[]> => SpeechToText.record(hints)
export const stop = (): Promise<void> => SpeechToText.stop()
export const openVoiceInputSettings = (): Promise<void> => SpeechToText.openVoiceInputSettings()
