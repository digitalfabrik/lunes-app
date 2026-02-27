import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import React from 'react'

import { RoutesParams } from '../../../navigation/NavigationTypes'
import { RepetitionService } from '../../../services/RepetitionService'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../../testing/render'
import WordChoiceExerciseScreen from '../WordChoiceExerciseScreen'

jest.mock('../../../components/FavoriteButton', () => {
  const Text = require('react-native').Text
  return () => <Text>FavoriteButton</Text>
})
jest.mock('../../../components/CheatMode', () => {
  const Text = require('react-native').Text
  return () => <Text>CheatMode</Text>
})
jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn(it => it),
}))

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})
jest.mock('react-native-image-zoom-viewer', () => {
  const Text = require('react-native').Text
  return () => <Text>ImageZoomViewer</Text>
})

jest.mock('react-native/Libraries/LogBox/Data/LogBoxData')
jest.mock('../../../services/storageUtils', () => ({
  saveExerciseProgress: jest.fn().mockResolvedValue(undefined),
}))

describe('WordChoiceExerciseScreen', () => {
  // at least 4 vocabularyItems are needed to generate sufficient false answers
  const vocabularyItems = new VocabularyItemBuilder(4).build()

  const navigation = createNavigationMock<'WordChoiceExercise'>()
  const route: RouteProp<RoutesParams, 'WordChoiceExercise'> = {
    key: '',
    name: 'WordChoiceExercise',
    params: {
      contentType: 'standard',
      vocabularyItems,
      unitId: { id: 1, type: 'standard' },
      unitTitle: 'TestTitel',
    },
  }

  let storageCache: StorageCache
  let repetitionService: RepetitionService

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
    repetitionService = RepetitionService.fromStorageCache(storageCache)
  })

  const renderScreen = () =>
    renderWithStorageCache(storageCache, <WordChoiceExerciseScreen route={route} navigation={navigation} />)

  it('should render initially with the first word and tryLater button', () => {
    const { getByText, queryByText } = renderScreen()

    expect(getByText('Spachtel')).toBeVisible()
    expect(getByText(getLabels().exercises.tryLater)).toBeVisible()
    expect(queryByText(getLabels().exercises.next)).toBeNull()
  })

  it('should show Next button and hide tryLater after selecting an answer', () => {
    const { getByText, queryByText } = renderScreen()

    fireEvent(getByText('Spachtel'), 'pressOut')

    expect(getByText(getLabels().exercises.next)).toBeVisible()
    expect(queryByText(getLabels().exercises.tryLater)).toBeNull()
  })

  it('should not show tryLater button on last word', () => {
    const { getByText, queryByText } = renderScreen()

    fireEvent(getByText('Spachtel'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('Auto'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('Hose'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))

    expect(queryByText(getLabels().exercises.tryLater)).toBeNull()
  })

  it('should navigate to ExerciseFinished after completing all words', async () => {
    const { getByText } = renderScreen()

    fireEvent(getByText('Spachtel'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('Auto'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('Hose'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('Helm'), 'pressOut')

    expect(getByText(getLabels().exercises.showResults)).toBeVisible()
    fireEvent.press(getByText(getLabels().exercises.showResults))

    await waitFor(() => expect(navigation.popTo).toHaveBeenCalledWith('ExerciseFinished', expect.anything()))
  })

  it('should repeat a word after an incorrect answer', async () => {
    const { getByText } = renderScreen()

    // Click a wrong answer for Spachtel
    fireEvent(getByText('Auto'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))

    // Complete the remaining words correctly
    fireEvent(getByText('Auto'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('Hose'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('Helm'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))

    // Spachtel was answered incorrectly, so the exercise is not done yet
    expect(navigation.popTo).not.toHaveBeenCalled()

    // Answer the repeated Spachtel correctly to finish
    fireEvent(getByText('Spachtel'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.showResults))

    await waitFor(() => expect(navigation.popTo).toHaveBeenCalledWith('ExerciseFinished', expect.anything()))
  })

  it('should allow to skip an exercise and try it out later', () => {
    const { getByText, queryByText } = renderScreen()

    fireEvent.press(getByText(getLabels().exercises.tryLater))
    fireEvent(getByText('Auto'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('Hose'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))
    fireEvent(getByText('Helm'), 'pressOut')
    fireEvent.press(getByText(getLabels().exercises.next))

    expect(queryByText(getLabels().exercises.tryLater)).toBeNull()
    fireEvent(getByText('Spachtel'), 'pressOut')
    expect(getByText(getLabels().exercises.showResults)).toBeVisible()
  })

  describe('repetition service', () => {
    it('does not add a word to the repetition service when the answer was correct', async () => {
      const { getByText } = renderScreen()

      fireEvent(getByText('Spachtel'), 'pressOut')

      await waitFor(() => expect(repetitionService.getWordNodeCards()).toHaveLength(0))
    })

    it('adds a word to the repetition service when the answer was incorrect', async () => {
      const { getByText } = renderScreen()

      fireEvent(getByText('Auto'), 'pressOut')

      await waitFor(() => expect(repetitionService.getWordNodeCards()).toHaveLength(1))
    })
  })

  describe('repetition exercise', () => {
    const repetitionRoute: RouteProp<RoutesParams, 'WordChoiceExercise'> = {
      key: '',
      name: 'WordChoiceExercise',
      params: {
        contentType: 'repetition',
        vocabularyItems,
        unitId: { id: 1, type: 'standard' },
        unitTitle: 'TestTitel',
      },
    }

    const renderRepetitionScreen = () =>
      renderWithStorageCache(storageCache, <WordChoiceExerciseScreen route={repetitionRoute} navigation={navigation} />)

    it('moves word card to the next section after a correct answer', async () => {
      await repetitionService.addWordToFirstSection(vocabularyItems[0])
      expect(repetitionService.getWordNodeCards()[0].section).toBe(0)

      const { getByText } = renderRepetitionScreen()
      fireEvent(getByText('Spachtel'), 'pressOut')

      await waitFor(() => expect(repetitionService.getWordNodeCards()[0].section).toBe(1))
    })
  })
})
