import SpeechToText from './NativeSpeechToText'

export type SpeechToTextParams = {
  hints?: string[]
}

export const record = ({ hints = [] }: SpeechToTextParams): Promise<string[]> => SpeechToText.record(hints)
