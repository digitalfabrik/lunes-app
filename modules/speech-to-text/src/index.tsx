import SpeechToText from './NativeSpeechToText'

export type SpeechToTextParams = {
  hints?: string[]
}

export const SPEECH_TO_TEXT_ERRORS = {
  recognitionUnavailable: 'E_RECOGNITION_UNAVAILABLE',
  languageUnavailable: 'E_LANGUAGE_UNAVAILABLE',
  // The platform/API cannot transcribe an audio file (e.g. Android below API 31 or without an
  // on-device recognizer). Callers should fall back to comparing against the written word.
  fileTranscriptionUnavailable: 'E_FILE_TRANSCRIPTION_UNAVAILABLE',
  // File transcription was attempted but failed (decode error, recognizer error or no match).
  fileTranscriptionFailed: 'E_FILE_TRANSCRIPTION_FAILED',
} as const

export type SpeechToTextErrorCode = (typeof SPEECH_TO_TEXT_ERRORS)[keyof typeof SPEECH_TO_TEXT_ERRORS]

export const record = ({ hints = [] }: SpeechToTextParams): Promise<string[]> => SpeechToText.record(hints)
export const transcribeAudioFile = (fileUri: string, hints: string[] = []): Promise<string[]> =>
  SpeechToText.transcribeAudioFile(fileUri, hints)
export const stop = (): Promise<void> => SpeechToText.stop()
export const openVoiceInputSettings = (): Promise<void> => SpeechToText.openVoiceInputSettings()
