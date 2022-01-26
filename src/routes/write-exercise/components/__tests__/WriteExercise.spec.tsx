import { RouteProp } from '@react-navigation/native'
import { fireEvent, render, RenderAPI, waitFor } from '@testing-library/react-native'
import React from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts from 'react-native-tts'

import { ARTICLES } from '../../../../constants/data'
import labels from '../../../../constants/labels.json'
import { RoutesParams } from '../../../../navigation/NavigationTypes'
import createNavigationMock from '../../../../testing/createNavigationPropMock'
import wrapWithTheme from '../../../../testing/wrapWithTheme'
import WriteExercise from '../WriteExercise'

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(async () => 'success'),
  setDefaultLanguage: jest.fn(async () => undefined),
  requestInstallEngine: jest.fn(async () => undefined),
  addListener: jest.fn(() => ({})),
  speak: jest.fn()
}))

jest.mock('react-native-sound-player', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  loadUrl: jest.fn()
}))

describe('WriteExercise', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const documents = [
    {
      id: 1,
      word: 'Spachtel',
      article: ARTICLES[1],
      document_image: [{ id: 1, image: 'Spachtel' }],
      audio: 'https://example.com/my-audio',
      alternatives: [
        {
          word: 'Spachtel',
          article: ARTICLES[2]
        },
        {
          word: 'Alternative',
          article: ARTICLES[2]
        }
      ]
    },
    {
      id: 2,
      word: 'Hammer',
      article: ARTICLES[1],
      document_image: [{ id: 1, image: 'Hammer' }],
      audio: '',
      alternatives: []
    }
  ]

  const navigation = createNavigationMock<'WriteExercise'>()
  const route: RouteProp<RoutesParams, 'WriteExercise'> = {
    key: '',
    name: 'WriteExercise',
    params: {
      discipline: {
        id: 1,
        title: 'TestTitel',
        description: '',
        icon: '',
        numberOfChildren: 2,
        isLeaf: true,
        isRoot: false,
        needsTrainingSetEndpoint: true
      }
    }
  }

  const renderWriteExercise = (): RenderAPI => {
    return render(<WriteExercise documents={documents} route={route} navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
  }

  it('should allow to skip an exercise and try it out later', () => {
    const { getByText } = renderWriteExercise()

    fireEvent.press(getByText(labels.exercises.tryLater))
    fireEvent.press(getByText(labels.exercises.write.showSolution))
    expect(getByText(labels.exercises.next)).toBeDefined()
  })

  it('should not allow to skip last document', () => {
    const { queryByText, getByText } = renderWriteExercise()

    expect(labels.exercises.tryLater).not.toBeNull()
    fireEvent.press(getByText(labels.exercises.write.showSolution))
    fireEvent.press(getByText(labels.exercises.next))
    expect(queryByText(labels.exercises.tryLater)).toBeNull()
  })

  it('should show solution after three wrong entries', async () => {
    const { getByPlaceholderText, getByText } = renderWriteExercise()
    fireEvent.press(getByText(labels.exercises.write.showSolution))
    fireEvent.press(getByText(labels.exercises.next))

    fireEvent.changeText(getByPlaceholderText(labels.exercises.write.insertAnswer), 'Das Falsche')
    fireEvent.press(getByText(labels.exercises.write.checkInput))
    fireEvent.press(getByText(labels.exercises.next))

    fireEvent.changeText(getByPlaceholderText(labels.exercises.write.insertAnswer), 'Das Falsche2')
    fireEvent.press(getByText(labels.exercises.write.checkInput))
    fireEvent.press(getByText(labels.exercises.next))

    fireEvent.changeText(getByPlaceholderText(labels.exercises.write.insertAnswer), 'Das Falsche3')
    fireEvent.press(getByText(labels.exercises.write.checkInput))
    expect(
      getByText(
        `${labels.exercises.write.feedback.wrongWithSolution} „${documents[1].article.value} ${documents[1].word}“`
      )
    ).toBeDefined()
    expect(getByText(labels.exercises.showResults)).toBeDefined()
  })

  it('should show solution after three times almost correct', () => {
    const { getByPlaceholderText, getByText } = renderWriteExercise()
    const submission = 'Der Spachtl'

    const inputField = getByPlaceholderText(labels.exercises.write.insertAnswer)
    fireEvent.changeText(inputField, submission)
    const button = getByText(labels.exercises.write.checkInput)
    fireEvent.press(button)
    expect(
      getByText(
        `${labels.exercises.write.feedback.almostCorrect1} „${submission}“ ${labels.exercises.write.feedback.almostCorrect2}`
      )
    ).toBeDefined()

    fireEvent.press(getByText(labels.exercises.write.checkInput))
    fireEvent.press(getByText(labels.exercises.write.checkInput))
    expect(
      getByText(
        `${labels.exercises.write.feedback.wrongWithSolution} „${documents[0].article.value} ${documents[0].word}“`
      )
    ).toBeDefined()
    expect(getByText(labels.exercises.next)).toBeDefined()
  })

  it('should show continue or finish exercise', () => {
    const { getByText } = renderWriteExercise()
    fireEvent.press(getByText(labels.exercises.write.showSolution))
    fireEvent.press(getByText(labels.exercises.next))
    fireEvent.press(getByText(labels.exercises.write.showSolution))
    fireEvent.press(getByText(labels.exercises.showResults))
  })

  const evaluate = async (input: string, expectedFeedback: string): Promise<void> => {
    const { getByPlaceholderText, getByText } = renderWriteExercise()
    const inputField = await getByPlaceholderText(labels.exercises.write.insertAnswer)
    await fireEvent.changeText(inputField, input)
    const button = await getByText(labels.exercises.write.checkInput)
    await fireEvent.press(button)
    expect(getByText(expectedFeedback.replace('\n', ''))).toBeDefined()
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
    await evaluate('Das Falsche', `${labels.exercises.write.feedback.wrong}`)
  })

  it('should play audio if available and no alternative solution submitted', async () => {
    const { getByPlaceholderText, getByText, getByRole } = renderWriteExercise()
    const inputField = await getByPlaceholderText(labels.exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'Der Spachtel')
    const button = await getByText(labels.exercises.write.checkInput)
    fireEvent.press(button)

    // Play audio
    const audioButton = getByRole('button')
    fireEvent.press(audioButton)

    expect(SoundPlayer.loadUrl).toHaveBeenCalledTimes(1)
    expect(SoundPlayer.loadUrl).toHaveBeenCalledWith(documents[0].audio)
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play submitted alternative', async () => {
    const { getByPlaceholderText, getByText, getByRole } = renderWriteExercise()
    const inputField = getByPlaceholderText(labels.exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'Die Alternative')
    const button = getByText(labels.exercises.write.checkInput)
    fireEvent.press(button)

    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    // Play audio
    fireEvent.press(getByRole('button'))

    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith('Die Alternative', expect.any(Object))
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))
  })
})
