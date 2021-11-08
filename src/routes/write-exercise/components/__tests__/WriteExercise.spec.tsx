import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts from 'react-native-tts'

import labels from '../../../../constants/labels.json'
import wrapWithTheme from '../../../../testing/wrapWithTheme'
import WriteExercise, { AnswerSectionPropsType } from '../WriteExercise'

jest.mock('../../../../services/AsyncStorage')

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(async () => 'success'),
  setDefaultLanguage: jest.fn(async () => undefined),
  requestInstallEngine: jest.fn(async () => undefined),
  addEventListener: jest.fn(() => undefined),
  removeEventListener: jest.fn(() => undefined),
  speak: jest.fn()
}))

jest.mock('react-native-sound-player', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  loadUrl: jest.fn()
}))
jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

describe('WriteExercise', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const document = {
    id: 1,
    word: 'Spachtel',
    article: {
      id: 1,
      value: 'Der'
    },
    document_image: [{ id: 1, image: '' }],
    audio: '',
    alternatives: [
      {
        word: 'Spachtel',
        article: {
          id: 2,
          value: 'Die'
        }
      },
      {
        word: 'Alternative',
        article: {
          id: 2,
          value: 'Die'
        }
      }
    ]
  }

  const audioDocument = {
    ...document,
    audio: 'https://example.com/my-audio'
  }

  const defaultAnswerSectionProps: AnswerSectionPropsType = {
    documents: [document],
    disciplineId: 1,
    currentDocumentNumber: 0,
    tryLater: () => {},
    finishExercise: () => {},
    setCurrentDocumentNumber: () => {}
  }

  const audioAnswerSectionProps = {
    ...defaultAnswerSectionProps,
    documents: [audioDocument]
  }

  const evaluate = async (input: string, expectedFeedback: string): Promise<void> => {
    const { getByPlaceholderText, getByText, getByTestId } = render(<WriteExercise {...defaultAnswerSectionProps} />, {
      wrapper: wrapWithTheme
    })
    // Fixes errors that tests are not wrapped in act
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    const inputField = await getByPlaceholderText(labels.exercises.write.insertAnswer)
    await fireEvent.changeText(inputField, input)
    const button = await getByText(labels.exercises.write.checkInput)
    await fireEvent.press(button)
    const result = await getByTestId('feedback-write-exercise')
    expect(result.children[0]).toEqual(expectedFeedback)
  }

  it('should show correct-feedback for correct solution', async () => {
    await evaluate('Der Spachtel', labels.exercises.write.feedback.correct)
  })

  it('should show correct-feedback for alternative article', async () => {
    await evaluate('Die Spachtel', labels.exercises.write.feedback.correct)
  })

  it('should show correct-feedback for alternative solution', async () => {
    await evaluate('Die Alternative', labels.exercises.write.feedback.correct)
  })

  it('should show almost correct feedback', async () => {
    const input = 'Die Spachtl'
    await evaluate(
      input,
      `${labels.exercises.write.feedback.almostCorrect1} „${input}“ ${labels.exercises.write.feedback.almostCorrect2}`
    )
  })

  it('should show wrong feedback', async () => {
    await evaluate(
      'Das Falsche',
      `${labels.exercises.write.feedback.wrong} „${defaultAnswerSectionProps.documents[0].article.value} ${defaultAnswerSectionProps.documents[0].word}“`
    )
  })

  it('should play audio if available and no alternative solution submitted', async () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<WriteExercise {...audioAnswerSectionProps} />, {
      wrapper: wrapWithTheme
    })
    const inputField = await getByPlaceholderText(labels.exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'Der Spachtel')
    const button = await getByText(labels.exercises.write.checkInput)
    fireEvent.press(button)

    // Play audio
    fireEvent.press(getByRole('button'))

    expect(SoundPlayer.loadUrl).toHaveBeenCalledTimes(1)
    expect(SoundPlayer.loadUrl).toHaveBeenCalledWith(audioDocument.audio)
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play submitted alternative', async () => {
    const { getByPlaceholderText, getByText, getByRole } = render(<WriteExercise {...defaultAnswerSectionProps} />, {
      wrapper: wrapWithTheme
    })
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))
    const inputField = await getByPlaceholderText(labels.exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'Die Alternative')
    const button = await getByText(labels.exercises.write.checkInput)
    fireEvent.press(button)

    // Play audio
    fireEvent.press(getByRole('button'))

    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith('Die Alternative', expect.any(Object))
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))
  })
})
