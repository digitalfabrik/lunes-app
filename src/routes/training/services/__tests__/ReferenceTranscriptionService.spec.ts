import { downloadFile, unlink } from '@dr.pogodin/react-native-fs'
import { mocked } from 'jest-mock'
import { transcribeAudioFile } from 'react-native-speech-to-text'

import { reportError } from '../../../../services/sentry'
import { getReferenceTranscripts } from '../ReferenceTranscriptionService'

jest.mock('@dr.pogodin/react-native-fs', () => ({
  CachesDirectoryPath: '/caches',
  downloadFile: jest.fn(),
  unlink: jest.fn(),
}))
jest.mock('react-native-speech-to-text', () => ({
  SPEECH_TO_TEXT_ERRORS: {
    fileTranscriptionUnavailable: 'E_FILE_TRANSCRIPTION_UNAVAILABLE',
    fileTranscriptionFailed: 'E_FILE_TRANSCRIPTION_FAILED',
  },
  transcribeAudioFile: jest.fn(),
}))
jest.mock('../../../../services/sentry')

const mockDownloadFile = mocked(downloadFile)
const mockUnlink = mocked(unlink)
const mockTranscribeAudioFile = mocked(transcribeAudioFile)

const resolvedDownload = { jobId: 1, promise: Promise.resolve({ statusCode: 200 }) } as ReturnType<typeof downloadFile>

describe('getReferenceTranscripts', () => {
  // The service caches per URL for the process lifetime, so every test uses a unique URL.
  let urlCounter = 0
  const uniqueAudioUrl = (): string => {
    urlCounter += 1
    return `https://example.com/audio-${urlCounter}.mp3`
  }

  beforeEach(() => {
    mockDownloadFile.mockReturnValue(resolvedDownload)
    mockUnlink.mockResolvedValue()
    mockTranscribeAudioFile.mockResolvedValue(['der Baiser'])
  })

  it('should resolve to null without downloading when the audio url is null', async () => {
    await expect(getReferenceTranscripts(null, [])).resolves.toBeNull()
    expect(mockDownloadFile).not.toHaveBeenCalled()
  })

  it('should resolve to null without downloading when the audio url is empty', async () => {
    await expect(getReferenceTranscripts('', [])).resolves.toBeNull()
    expect(mockDownloadFile).not.toHaveBeenCalled()
  })

  it('should download, transcribe and clean up the temp file on success', async () => {
    const audioUrl = uniqueAudioUrl()

    await expect(getReferenceTranscripts(audioUrl, ['Baiser'])).resolves.toEqual(['der Baiser'])

    expect(mockDownloadFile).toHaveBeenCalledWith(expect.objectContaining({ fromUrl: audioUrl }))
    expect(mockTranscribeAudioFile).toHaveBeenCalledWith(expect.stringContaining('/caches/ref-'), ['Baiser'])
    expect(mockUnlink).toHaveBeenCalled()
  })

  it('should keep the source file extension so the recognizer can open the file', async () => {
    await getReferenceTranscripts('https://example.com/some-word.mp3', [])

    expect(mockDownloadFile).toHaveBeenCalledWith(expect.objectContaining({ toFile: expect.stringMatching(/\.mp3$/) }))
    expect(mockTranscribeAudioFile).toHaveBeenCalledWith(expect.stringMatching(/\.mp3$/), [])
  })

  it('should resolve to null when the download fails', async () => {
    mockDownloadFile.mockReturnValue({ jobId: 2, promise: Promise.reject(new Error('network')) } as ReturnType<
      typeof downloadFile
    >)

    await expect(getReferenceTranscripts(uniqueAudioUrl(), [])).resolves.toBeNull()
  })

  it('should resolve to null without reporting an error when file transcription is unavailable', async () => {
    mockTranscribeAudioFile.mockRejectedValue({ code: 'E_FILE_TRANSCRIPTION_UNAVAILABLE' })

    await expect(getReferenceTranscripts(uniqueAudioUrl(), [])).resolves.toBeNull()
    expect(reportError).not.toHaveBeenCalled()
  })

  it('should resolve to null when the transcription returns no candidates', async () => {
    mockTranscribeAudioFile.mockResolvedValue([])

    await expect(getReferenceTranscripts(uniqueAudioUrl(), [])).resolves.toBeNull()
  })

  it('should download only once for repeated calls with the same url', async () => {
    const audioUrl = uniqueAudioUrl()

    await getReferenceTranscripts(audioUrl, [])
    await getReferenceTranscripts(audioUrl, [])

    expect(mockDownloadFile).toHaveBeenCalledTimes(1)
  })
})
