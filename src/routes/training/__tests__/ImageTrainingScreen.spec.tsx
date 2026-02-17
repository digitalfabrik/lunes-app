import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { MAX_TRAINING_REPETITIONS } from '../../../constants/data'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getWordsByJob } from '../../../services/CmsApi'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import renderWithTheme from '../../../testing/render'
import ImageTrainingScreen, { initializeState, stateReducer } from '../ImageTrainingScreen'

jest.mock('../../../services/helpers', () => ({
  ...jest.requireActual('../../../services/helpers'),
  shuffleArray: jest.fn(it => it),
}))
jest.mock('../../../services/CmsApi')

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('ImageTrainingScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(MAX_TRAINING_REPETITIONS).build()
  const navigation = createNavigationMock<'ImageTraining'>()
  const route: RouteProp<RoutesParams, 'ImageTraining'> = {
    key: '',
    name: 'ImageTraining',
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

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(Math, 'random').mockReturnValue(0)
    mocked(getWordsByJob).mockResolvedValue(vocabularyItems.slice())
  })

  const renderScreenAndWaitForLoad = async () => {
    const result = renderWithTheme(<ImageTrainingScreen navigation={navigation} route={route} />)
    await expect(result.findByText(getLabels().exercises.training.image.selectImage)).resolves.toBeVisible()
    return result
  }

  it('should render initially', async () => {
    const { getByText, getAllByTestId, getByTestId } = await renderScreenAndWaitForLoad()

    expect(getByText(getLabels().exercises.training.image.selectImage)).toBeVisible()
    expect(getAllByTestId('imageOption')).toHaveLength(4)
    expect(getByText('Spachtel')).toBeVisible()

    const skipButton = getByTestId('button-skip')
    expect(skipButton).toBeVisible()
  })

  it('should keep Skip button after selecting incorrect image', async () => {
    const { getAllByTestId, getByTestId, queryByText } = await renderScreenAndWaitForLoad()

    const images = getAllByTestId('imageOption')
    fireEvent.press(images[1])

    expect(getByTestId('button-skip')).toBeVisible()
    expect(queryByText(getLabels().exercises.continue)).toBeNull()
  })

  it('should advance to next word after pressing Continue', async () => {
    const { getAllByTestId, getByText, queryByText } = await renderScreenAndWaitForLoad()

    const images = getAllByTestId('imageOption')
    fireEvent.press(images[0])
    fireEvent.press(getByText(getLabels().exercises.continue))

    expect(queryByText('Spachtel')).toBeNull()
    expect(getByText('Auto')).toBeVisible()
  })

  it('should advance to next word after pressing Skip', async () => {
    const { getByTestId, getByText, queryByText } = await renderScreenAndWaitForLoad()

    fireEvent.press(getByTestId('button-skip'))

    expect(queryByText('Spachtel')).toBeNull()
    expect(getByText('Auto')).toBeVisible()
  })

  it('should navigate to TrainingFinished after completing all words', async () => {
    const { getByTestId } = await renderScreenAndWaitForLoad()

    for (let i = 0; i < MAX_TRAINING_REPETITIONS; i += 1) {
      fireEvent.press(getByTestId('button-skip'))
    }

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'image',
        results: { correct: 0, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })

  it('should pass correct answer count to TrainingFinished', async () => {
    const { getAllByTestId, getByText, getByTestId } = await renderScreenAndWaitForLoad()

    for (let i = 0; i < 3; i += 1) {
      const images = getAllByTestId('imageOption')
      fireEvent.press(images[0])
      fireEvent.press(getByText(getLabels().exercises.continue))
    }

    for (let i = 3; i < MAX_TRAINING_REPETITIONS; i += 1) {
      fireEvent.press(getByTestId('button-skip'))
    }

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'image',
        results: { correct: 3, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })

  it('should not count answer as correct on second attempt', async () => {
    const { getAllByTestId, getByTestId, getByText } = await renderScreenAndWaitForLoad()

    const images = getAllByTestId('imageOption')
    fireEvent.press(images[1])
    fireEvent.press(images[0])
    fireEvent.press(getByText(getLabels().exercises.continue))

    for (let i = 1; i < MAX_TRAINING_REPETITIONS; i += 1) {
      fireEvent.press(getByTestId('button-skip'))
    }

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'image',
        results: { correct: 0, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })

  it('should correctly update the state', () => {
    let state = initializeState(vocabularyItems.slice())
    expect(state.vocabularyItems).toEqual(vocabularyItems.slice(0, MAX_TRAINING_REPETITIONS))
    expect(state.vocabularyItems).toHaveLength(MAX_TRAINING_REPETITIONS)

    for (let i = 0; i < MAX_TRAINING_REPETITIONS; i += 1) {
      expect(state.completed).toBe(false)
      expect(state.currentVocabularyItemIndex).toEqual(i)
      expect(state.correctAnswersCount).toBe(0)
      expect(state.choices).toContainEqual({
        src: state.vocabularyItems[state.currentVocabularyItemIndex].images[0],
        key: state.vocabularyItems[state.currentVocabularyItemIndex].id,
      })
      state = stateReducer(state, { type: 'nextWord' })
    }

    expect(state.completed).toBe(true)
  })

  it('should count correct answers', () => {
    let state = initializeState(vocabularyItems.slice())
    expect(state.correctAnswersCount).toBe(0)

    state = stateReducer(state, { type: 'selectAnswer', key: state.vocabularyItems[0].id })
    state = stateReducer(state, { type: 'nextWord' })
    expect(state.correctAnswersCount).toBe(1)

    state = stateReducer(state, { type: 'selectAnswer', key: state.vocabularyItems[0].id })
    state = stateReducer(state, { type: 'nextWord' })
    expect(state.correctAnswersCount).toBe(1)

    state = stateReducer(state, { type: 'selectAnswer', key: state.vocabularyItems[2].id })
    state = stateReducer(state, { type: 'nextWord' })
    expect(state.correctAnswersCount).toBe(2)
  })
})
