import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { Image, View } from 'react-native'

import { BottomSheetProps } from '../../../components/BottomSheet'
import { MAX_TRAINING_REPETITIONS } from '../../../constants/data'
import useGrantPermissions from '../../../hooks/useGrantPermissions'
import useVoiceRecognition from '../../../hooks/useVoiceRecognition'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getWordsByJob } from '../../../services/CmsApi'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import renderWithTheme from '../../../testing/render'
import SpeechTrainingScreen from '../SpeechTrainingScreen'

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
  },
  openVoiceInputSettings: jest.fn(),
}))

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
  })

  const renderScreenAndWaitForLoad = async () => {
    const result = renderWithTheme(<SpeechTrainingScreen navigation={navigation} route={route} />)
    await result.findByTestId('recording-button')
    return result
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

  it('should navigate to TrainingFinished after skipping all words', async () => {
    const { getByText } = await renderScreenAndWaitForLoad()

    for (let i = 0; i < MAX_TRAINING_REPETITIONS; i += 1) {
      fireEvent.press(getByText(getLabels().exercises.skip))
    }

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: 0, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })

  it('should count a word as correct only when answered correctly on first try', async () => {
    mockStartRecording.mockResolvedValue(['der Spachtel'])
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')
    await waitFor(() => getByText(getLabels().exercises.continue))
    fireEvent.press(getByText(getLabels().exercises.continue))

    for (let i = 1; i < MAX_TRAINING_REPETITIONS; i += 1) {
      fireEvent.press(getByText(getLabels().exercises.skip))
    }

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: 1, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })

  it('should not count a word as correct when it needed a retry', async () => {
    mockStartRecording.mockResolvedValueOnce(['etwas anderes'])
    const { getByTestId, getByText } = await renderScreenAndWaitForLoad()

    fireEvent(getByTestId('recording-button'), 'pressIn')
    await waitFor(() => getByText(getLabels().exercises.tryAgain))
    fireEvent.press(getByText(getLabels().exercises.tryAgain))

    mockStartRecording.mockResolvedValueOnce(['der Spachtel'])
    fireEvent(getByTestId('recording-button'), 'pressIn')
    await waitFor(() => getByText(getLabels().exercises.continue))
    fireEvent.press(getByText(getLabels().exercises.continue))

    for (let i = 1; i < MAX_TRAINING_REPETITIONS; i += 1) {
      fireEvent.press(getByText(getLabels().exercises.skip))
    }

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'speech',
        results: { correct: 0, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })

  it('should show not authorized view when permissions are denied', async () => {
    mocked(useGrantPermissions).mockReturnValue({ permissionRequested: true, permissionGranted: false })
    const { findByTestId } = renderWithTheme(<SpeechTrainingScreen navigation={navigation} route={route} />)

    await expect(findByTestId('no-auth')).resolves.toBeVisible()
  })
})
