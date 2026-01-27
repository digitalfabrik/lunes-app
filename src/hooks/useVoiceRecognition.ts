type VoiceRecognition = {
  startRecording: () => void
  stopRecording: () => void
  active: boolean
}

const useVoiceRecognition = (_onResults: (results: string[] | null) => void): VoiceRecognition => ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  startRecording: async () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  stopRecording: async () => {},
  active: false,
})

export default useVoiceRecognition
