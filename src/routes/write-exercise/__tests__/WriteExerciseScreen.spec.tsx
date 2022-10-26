import { CommonActions, RouteProp } from '@react-navigation/native'
import { act, fireEvent, RenderAPI, waitFor } from '@testing-library/react-native'
import React, { ReactElement } from 'react'
import SoundPlayer from 'react-native-sound-player'
import Tts from 'react-native-tts'

import { ExerciseKeys, SIMPLE_RESULTS } from '../../../constants/data'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { saveExerciseProgress } from '../../../services/AsyncStorage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import WriteExerciseScreen from '../WriteExerciseScreen'

jest.mock('../../../components/FavoriteButton', () => () => {
  const { Text } = require('react-native')
  return <Text>FavoriteButton</Text>
})

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn(it => it),
}))

jest.mock('../../../services/AsyncStorage', () => ({
  saveExerciseProgress: jest.fn(),
  getDevMode: jest.fn(async () => false),
}))
jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')

jest.mock('react-native-popover-view')

jest.mock('react-native/Libraries/Image/Image', () => ({
  ...jest.requireActual('react-native/Libraries/Image/Image'),
  getSize: (uri: string, success: (w: number, h: number) => void) => {
    success(1234, 1234)
  },
}))

jest.mock('react-native-keyboard-aware-scroll-view', () => {
  const { View } = require('react-native')
  return {
    KeyboardAwareScrollView: ({ children }: { children: ReactElement }) => <View>{children}</View>,
  }
})

jest.mock('react-native-tts', () => ({
  getInitStatus: jest.fn(async () => 'success'),
  setDefaultLanguage: jest.fn(async () => undefined),
  requestInstallEngine: jest.fn(async () => undefined),
  addListener: jest.fn(() => ({})),
  speak: jest.fn(),
}))

jest.mock('react-native-sound-player', () => ({
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  loadUrl: jest.fn(),
}))

describe('WriteExerciseScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(2).build()

  const navigation = createNavigationMock<'WriteExercise'>()
  const route: RouteProp<RoutesParams, 'WriteExercise'> = {
    key: '',
    name: 'WriteExercise',
    params: {
      vocabularyItems,
      disciplineId: 1,
      disciplineTitle: 'TestTitel',
      closeExerciseAction: CommonActions.goBack(),
    },
  }

  const renderWriteExercise = (): RenderAPI => render(<WriteExerciseScreen route={route} navigation={navigation} />)

  it('should allow to skip a vocabularyItem and try it out later', () => {
    const { getByText, getByPlaceholderText } = renderWriteExercise()

    fireEvent.press(getByText(getLabels().exercises.tryLater))

    fireEvent.changeText(getByPlaceholderText(getLabels().exercises.write.insertAnswer), 'das Auto')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    fireEvent.press(getByText(getLabels().exercises.next))

    fireEvent.changeText(getByPlaceholderText(getLabels().exercises.write.insertAnswer), 'die Spachtel')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    expect(getByText(getLabels().exercises.write.feedback.correct)).toBeTruthy()
  })

  it('should not allow to skip last vocabularyItem', () => {
    const { queryByText, getByText, getByPlaceholderText } = renderWriteExercise()

    expect(getLabels().exercises.tryLater).not.toBeNull()
    fireEvent.changeText(getByPlaceholderText(getLabels().exercises.write.insertAnswer), 'die Spachtel')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    fireEvent.press(getByText(getLabels().exercises.next))
    expect(queryByText(getLabels().exercises.tryLater)).toBeNull()
  })

  it('should show solution after three wrong tries', () => {
    const { getByPlaceholderText, getByText } = renderWriteExercise()
    fireEvent.changeText(getByPlaceholderText(getLabels().exercises.write.insertAnswer), 'die Spachtel')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    fireEvent.press(getByText(getLabels().exercises.next))

    fireEvent.changeText(getByPlaceholderText(getLabels().exercises.write.insertAnswer), 'das Falsche')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    fireEvent.press(getByText(getLabels().exercises.next))

    fireEvent.changeText(getByPlaceholderText(getLabels().exercises.write.insertAnswer), 'das Falsche2')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    fireEvent.press(getByText(getLabels().exercises.next))

    fireEvent.changeText(getByPlaceholderText(getLabels().exercises.write.insertAnswer), 'das Falsche3')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    expect(
      getByText(
        `${getLabels().exercises.write.feedback.wrongWithSolution} „${vocabularyItems[1].article.value} ${
          vocabularyItems[1].word
        }“`
      )
    ).toBeDefined()
    expect(getByText(getLabels().exercises.showResults)).toBeDefined()
  })

  it('should show solution after three times almost correct', () => {
    const { getByPlaceholderText, getByText } = renderWriteExercise()
    const submission = 'der Spachtl'

    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, submission)
    const button = getByText(getLabels().exercises.write.checkInput)
    fireEvent.press(button)
    expect(
      getByText(
        `${getLabels().exercises.write.feedback.almostCorrect1} „${submission}“ ${
          getLabels().exercises.write.feedback.almostCorrect2
        }`
      )
    ).toBeDefined()

    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    expect(
      getByText(
        `${getLabels().exercises.write.feedback.wrongWithSolution} „${vocabularyItems[0].article.value} ${
          vocabularyItems[0].word
        }“`
      )
    ).toBeDefined()
    expect(getByText(getLabels().exercises.next)).toBeDefined()
  })

  it('should finish exercise and save progress', async () => {
    const { getByPlaceholderText, getByText } = renderWriteExercise()
    fireEvent.changeText(getByPlaceholderText(getLabels().exercises.write.insertAnswer), 'die Spachtel')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))
    fireEvent.press(getByText(getLabels().exercises.next))

    fireEvent.changeText(getByPlaceholderText(getLabels().exercises.write.insertAnswer), 'das Auto')
    fireEvent.press(getByText(getLabels().exercises.write.checkInput))

    await act(async () => {
      fireEvent.press(getByText(getLabels().exercises.showResults))
    })

    expect(saveExerciseProgress).toHaveBeenCalledWith(1, ExerciseKeys.writeExercise, [
      { vocabularyItem: vocabularyItems[0], result: SIMPLE_RESULTS.correct, numberOfTries: 1 },
      { vocabularyItem: vocabularyItems[1], result: SIMPLE_RESULTS.correct, numberOfTries: 1 },
    ])
  })

  const evaluate = (input: string, expectedFeedback: string) => {
    const { getByPlaceholderText, getByText } = renderWriteExercise()
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, input)
    const button = getByText(getLabels().exercises.write.checkInput)
    fireEvent.press(button)
    expect(getByText(expectedFeedback.replace('\n', ''))).toBeDefined()
  }

  it('should show correct-feedback for correct solution', () => {
    evaluate('der Spachtel', getLabels().exercises.write.feedback.correct)
  })

  it('should show correct-feedback for alternative article', () => {
    evaluate('die Spachtel', getLabels().exercises.write.feedback.correct)
  })

  it('should show correct-feedback for alternative solution', () => {
    evaluate('die Alternative', getLabels().exercises.write.feedback.correct)
  })

  it('should show almost correct feedback', () => {
    const input = 'die Spachtl'
    evaluate(
      input,
      `${getLabels().exercises.write.feedback.almostCorrect1} „${input}“ ${
        getLabels().exercises.write.feedback.almostCorrect2
      }`
    )
  })

  it('should show wrong feedback with correct solution', () => {
    evaluate(
      'das Falsche',
      `${getLabels().exercises.write.feedback.wrong} ${getLabels().exercises.write.feedback.wrongWithSolution} „${
        vocabularyItems[0].article.value
      } ${vocabularyItems[0].word}“`
    )
  })

  it('should play audio if available and no alternative solution submitted', () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderWriteExercise()
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'der Spachtel')
    const button = getByText(getLabels().exercises.write.checkInput)
    fireEvent.press(button)

    // Play audio
    const audioButton = getByTestId('audio-player')
    fireEvent.press(audioButton)

    expect(SoundPlayer.loadUrl).toHaveBeenCalledTimes(1)
    expect(SoundPlayer.loadUrl).toHaveBeenCalledWith(vocabularyItems[0].audio)
    expect(Tts.speak).not.toHaveBeenCalled()
  })

  it('should play submitted alternative', async () => {
    const { getByPlaceholderText, getByText, getByTestId } = renderWriteExercise()
    const inputField = getByPlaceholderText(getLabels().exercises.write.insertAnswer)
    fireEvent.changeText(inputField, 'die Alternative')
    const button = getByText(getLabels().exercises.write.checkInput)
    fireEvent.press(button)

    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))

    // Play audio
    fireEvent.press(getByTestId('audio-player'))

    expect(Tts.speak).toHaveBeenCalledTimes(1)
    expect(Tts.speak).toHaveBeenCalledWith('die Alternative', expect.any(Object))
    expect(SoundPlayer.loadUrl).not.toHaveBeenCalled()
    await waitFor(() => expect(Tts.setDefaultLanguage).toHaveBeenCalledWith('de-DE'))
  })
})
