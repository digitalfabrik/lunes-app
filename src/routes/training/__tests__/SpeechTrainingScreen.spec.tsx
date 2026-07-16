import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { Image, View } from 'react-native'

import { BottomSheetProps } from '../../../components/BottomSheet'
import { MAX_TRAINING_REPETITIONS, NUMBER_OF_MAX_RETRIES } from '../../../constants/data'
import useGrantPermissions from '../../../hooks/useGrantPermissions'
import useVoiceRecognition from '../../../hooks/useVoiceRecognition'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getWordsByJob } from '../../../services/CmsApi'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import renderWithTheme, { renderWithStorageCache } from '../../../testing/render'
import SpeechTrainingScreen from '../SpeechTrainingScreen'
import { getReferenceTranscripts } from '../services/ReferenceTranscriptionService'

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn(it => it),
}))
jest.mock('../../../services/CmsApi')
jest.mock('../../../hooks/useGrantPermissions')
jest.mock('../../../hooks/useVoiceRecognition')
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))
jest.mock('react-native-speech-to-text', () => ({
  SPEECH_TO_TEXT_ERRORS: {
    recognitionUnavailable: 'E_RECOGNITION_UNAVAILABLE',
    languageUnavailable: 'E_LANGUAGE_UNAVAILABLE',
    fileTranscriptionUnavailable: 'E_FILE_TRANSCRIPTION_UNAVAILABLE',
    fileTranscriptionFailed: 'E_FILE_TRANSCRIPTION_FAILED',
  },
  transcribeAudioFile: jest.fn(),
  openVoiceInputSettings: jest.fn(),
}))
jest.mock('../services/ReferenceTranscriptionService')

jest.mock('../../../components/AudioPlayer', () => {
  const { Text } = require('react-native')
  return () => <Text>AudioPlayer</Text>
})

jest.mock(
  '../../../components/BottomSheet',
  () =>
    ({ visible, children }: BottomSheetProps) =>
      visible ? <View>{children}</View> : null,
)

describe('SpeechTrainingScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(MAX_TRAINING_REPETITIONS).build()
  const navigation = createNavigationMock<'SpeechTraining'>()
  const route: RouteProp<RoutesParams, 'SpeechTraining'> = {
    key: '',
    name: 'SpeechTraining',
    params: {
      job: {
        id: { type: 'standard', id: 0 },
        name: 'Test job',
        icon: 'icon',
        numberOfUnits: vocabularyItems.length,
        migrated: false,
      },
    },
  }
  const mockStartRecording = jest.fn()
  const mockStopRecording = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Image, 'prefetch').mockResolvedValue(true)
    mocked(getWordsByJob).mockResolvedValue(vocabularyItems.slice())
    mocked(useGrantPermissions).mockReturnValue({ permissionRequested: true, permissionGranted: true })
    mocked(useVoiceRecognition).mockReturnValue({
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      isRecording: false,
    })
    // By default no reference transcript is available, so the screen compares against the written word.
    mocked(getReferenceTranscripts).mockResolvedValue(null)
  })

  const renderScreenAndWaitForLoad = async () => {
    const result = renderWithTheme(<SpeechTrainingScreen navigation={navigation} route={route} />)
    await result.findByTestId('recording-button')
    return result
  }

  const renderInDevModeAndWaitForLoad = async () => {
    const storageCache = StorageCache.createDummy()
    await storageCache.setItem('isDevModeEnabled', true)
    const result = renderWithStorageCache(storageCache, <SpeechTrainingScreen navigation={navigation} route={route} />)
    await result.findByTestId('recording-button')
    return result
  }

  type RenderApi = Awaited<ReturnType<typeof renderScreenAndWaitForLoad>>

  const failCurrentWordToMax = async ({ getByTestId, getByText }: RenderApi): Promise<void> => {
    mockStartRecording.mockResolvedValue(['etwas ganz anderes'])
    Array.from({ length: NUMBER_OF_MAX_RETRIES }).forEach(() => fireEvent(getByTestId('recording-button'), 'pressIn'))
    await waitFor(() => getByText(getLabels().exercises.continue))
    fireEvent.press(getByText(getLabels().exercises.continue))
  }

  it('should render the recording button with instruction text', async () => {
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    expect(getByTestId('recording-button')).toBeVisible()
    expect(getByText(getLabels().exercises.training.speech.holdAndSpeak)).toBeVisible()
    expect(getByText(getLabels().exercises.skip)).toBeVisible()
  })

  it('should show correct feedback when word is recognized correctly', async () => {
    // VocabularyItemBuilder item 0: 'Spachtel', article 'der'
    mockStartRecording.mockResolvedValue(['der Spachtel'])
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')

    await waitFor(() => {
      expect(getByText(getLabels().exercises.training.speech.correct)).toBeVisible()
    })
    expect(getByText(getLabels().exercises.continue)).toBeVisible()
  })

  it('should mark correct when the spoken word matches the reference audio transcript but not the written word', async () => {
    // The recognizer transcribes both the reference audio and the user's speech as "der Besen",
    // which does not match the written word "Spachtel" — only the reference comparison accepts it.
    mocked(getReferenceTranscripts).mockResolvedValue(['der Besen'])
    mockStartRecording.mockResolvedValue(['der Besen'])
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')

    await waitFor(() => {
      expect(getByText(getLabels().exercises.training.speech.correct)).toBeVisible()
    })
  })

  it('should mark incorrect when the spoken word does not match the reference audio transcript', async () => {
    mocked(getReferenceTranscripts).mockResolvedValue(['der Spachtel'])
    mockStartRecording.mockResolvedValue(['der Besen'])
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')

    await waitFor(() => {
      expect(getByText(getLabels().exercises.training.speech.incorrect)).toBeVisible()
    })
  })

  it('should fall back to the written word when no reference transcript is available', async () => {
    mocked(getReferenceTranscripts).mockResolvedValue(null)
    mockStartRecording.mockResolvedValue(['der Spachtel'])
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')

    await waitFor(() => {
      expect(getByText(getLabels().exercises.training.speech.correct)).toBeVisible()
    })
  })

  it('should show incorrect feedback when word is not recognized', async () => {
    mockStartRecording.mockResolvedValue(['etwas ganz anderes'])
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')

    await waitFor(() => {
      expect(getByText(getLabels().exercises.training.speech.incorrect)).toBeVisible()
    })
    expect(getByText(getLabels().exercises.tryAgain)).toBeVisible()
  })

  it('should show error bottom sheet when speech recognition fails', async () => {
    mockStartRecording.mockRejectedValue(new Error('Recognition failed'))
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')

    await waitFor(() => {
      expect(getByText(getLabels().exercises.training.speech.notUnderstood)).toBeVisible()
    })
  })

  it('should return to recording state after retrying from error', async () => {
    mockStartRecording.mockRejectedValue(new Error('Recognition failed'))
    const { getByTestId, getByText, queryByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')
    await waitFor(() => getByText(getLabels().exercises.tryAgain))
    fireEvent.press(getByText(getLabels().exercises.tryAgain))

    expect(queryByText(getLabels().exercises.training.speech.notUnderstood)).toBeNull()
    expect(getByTestId('recording-button')).toBeVisible()
  })

  it('should return to recording state after retrying from incorrect', async () => {
    mockStartRecording.mockResolvedValue(['etwas ganz anderes'])
    const { getByTestId, getByText, queryByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')
    await waitFor(() => getByText(getLabels().exercises.tryAgain))
    fireEvent.press(getByText(getLabels().exercises.tryAgain))

    expect(queryByText(getLabels().exercises.training.speech.incorrect)).toBeNull()
    expect(getByTestId('recording-button')).toBeVisible()
  })

  it('should move a skipped word to the end of the stack to be tested again', async () => {
    // Two words so the skipped one has somewhere to go
    mocked(getWordsByJob).mockResolvedValue(vocabularyItems.slice(0, 2))
    const renderApi = await renderScreenAndWaitForLoad()
    const { getByText, queryByText } = renderApi

    fireEvent.press(getByText(getLabels().exercises.skip))

    await failCurrentWordToMax(renderApi)

    expect(navigation.replace).not.toHaveBeenCalled()
    expect(queryByText(getLabels().exercises.skip)).toBeNull()
  })

  it('should finish with all words correct when cheating to succeed', async () => {
    const { getByText } = await renderInDevModeAndWaitForLoad()

    fireEvent.press(getByText(getLabels().exercises.cheat.succeed))

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: MAX_TRAINING_REPETITIONS, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })

  it('should finish with no words correct when cheating to fail', async () => {
    const { getByText } = await renderInDevModeAndWaitForLoad()

    fireEvent.press(getByText(getLabels().exercises.cheat.fail))

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: 0, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })

  it('should count a word as correct only when answered correctly on the first try', async () => {
    mocked(getWordsByJob).mockResolvedValue(vocabularyItems.slice(0, 1))
    mockStartRecording.mockResolvedValue(['der Spachtel'])
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')
    await waitFor(() => getByText(getLabels().exercises.continue))
    fireEvent.press(getByText(getLabels().exercises.continue))

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: 1, total: 1 },
        job: route.params.job,
      }),
    )
  })

  it('should not count a word as correct when it needed a retry', async () => {
    mocked(getWordsByJob).mockResolvedValue(vocabularyItems.slice(0, 1))
    mockStartRecording.mockResolvedValueOnce(['etwas anderes'])
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')
    await waitFor(() => getByText(getLabels().exercises.tryAgain))
    fireEvent.press(getByText(getLabels().exercises.tryAgain))

    mockStartRecording.mockResolvedValueOnce(['der Spachtel'])
    fireEvent(getByTestId('recording-button'), 'pressIn')
    await waitFor(() => getByText(getLabels().exercises.continue))
    fireEvent.press(getByText(getLabels().exercises.continue))

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: 0, total: 1 },
        job: route.params.job,
      }),
    )
  })

  it('should show continue instead of try again after reaching the max number of attempts', async () => {
    mockStartRecording.mockResolvedValue(['etwas ganz anderes'])
    const { getByTestId, getByText, queryByText } = await renderScreenAndWaitForLoad()

    // Speak incorrectly until the attempt limit is reached
    Array.from({ length: NUMBER_OF_MAX_RETRIES }).forEach(() => fireEvent(getByTestId('recording-button'), 'pressIn'))

    await waitFor(() => expect(getByText(getLabels().exercises.continue)).toBeVisible())
    expect(queryByText(getLabels().exercises.tryAgain)).toBeNull()
  })

  it('should show not authorized view when permissions are denied', async () => {
    mocked(useGrantPermissions).mockReturnValue({ permissionRequested: true, permissionGranted: false })
    const { findByTestId } = renderWithTheme(<SpeechTrainingScreen navigation={navigation} route={route} />)

    await expect(findByTestId('no-auth')).resolves.toBeVisible()
  })
})
