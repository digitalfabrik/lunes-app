import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { ARTICLES, MAX_TRAINING_REPETITIONS, NUMBER_OF_MAX_RETRIES } from '../../../constants/data'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getWordsByJob } from '../../../services/CmsApi'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import renderWithTheme, { renderWithStorageCache } from '../../../testing/render'
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
    // With Math.random fixed at 0, initializeChoices always places the correct image first
    jest.spyOn(Math, 'random').mockReturnValue(0)
    mocked(getWordsByJob).mockResolvedValue(vocabularyItems.slice())
  })

  const renderScreenAndWaitForLoad = async () => {
    const result = renderWithTheme(<ImageTrainingScreen navigation={navigation} route={route} />)
    await expect(result.findByText(getLabels().exercises.training.image.selectImage)).resolves.toBeVisible()
    fireEvent(result.getByTestId('image-grid'), 'layout', { nativeEvent: { layout: { width: 300 } } })
    return result
  }

  const renderInDevModeAndWaitForLoad = async () => {
    const storageCache = StorageCache.createDummy()
    await storageCache.setItem('isDevModeEnabled', true)
    const result = renderWithStorageCache(storageCache, <ImageTrainingScreen navigation={navigation} route={route} />)
    await expect(result.findByText(getLabels().exercises.training.image.selectImage)).resolves.toBeVisible()
    return result
  }

  type RenderApi = Awaited<ReturnType<typeof renderScreenAndWaitForLoad>>

  const answerCurrentWordCorrectly = ({ getAllByTestId, getByText }: RenderApi): void => {
    fireEvent.press(getAllByTestId('imageOption')[0]!)
    fireEvent.press(getByText(getLabels().exercises.continue))
  }

  const failCurrentWordToMax = ({ getAllByTestId, getByText }: RenderApi): void => {
    const images = getAllByTestId('imageOption')
    Array.from({ length: NUMBER_OF_MAX_RETRIES }).forEach(() => fireEvent.press(images[1]!))
    fireEvent.press(getByText(getLabels().exercises.continue))
  }

  const shortVocabularyList = vocabularyItems.slice(0, 3)

  const renderShortExerciseAndWaitForLoad = async () => {
    mocked(getWordsByJob).mockResolvedValue(shortVocabularyList)
    return renderScreenAndWaitForLoad()
  }

  it('should render initially', async () => {
    const { getByText, queryByText, getAllByTestId, getByTestId } = await renderScreenAndWaitForLoad()

    expect(getByText(getLabels().exercises.training.image.selectImage)).toBeVisible()
    expect(getAllByTestId('imageOption')).toHaveLength(4)
    expect(getByText('Spachtel')).toBeVisible()

    const skipButton = getByTestId('button-skip')
    expect(skipButton).toBeVisible()

    expect(queryByText(getLabels().exercises.training.image.whatAre, { exact: false })).toBeNull()
    expect(getByText(getLabels().exercises.training.image.whatIs, { exact: false })).toBeVisible()
  })

  it('should correctly use plural form', async () => {
    mocked(getWordsByJob).mockResolvedValue(vocabularyItems.map(item => ({ ...item, article: ARTICLES[4] })))

    const { getByText, queryByText } = await renderScreenAndWaitForLoad()
    expect(getByText(getLabels().exercises.training.image.whatAre, { exact: false })).toBeVisible()
    expect(queryByText(getLabels().exercises.training.image.whatIs, { exact: false })).toBeNull()
  })

  it('should keep Skip button after selecting incorrect image', async () => {
    const { getAllByTestId, getByTestId, queryByText } = await renderScreenAndWaitForLoad()

    const images = getAllByTestId('imageOption')
    fireEvent.press(images[1]!)

    expect(getByTestId('button-skip')).toBeVisible()
    expect(queryByText(getLabels().exercises.continue)).toBeNull()
  })

  it('should advance to next word after pressing Continue', async () => {
    const { getAllByTestId, getByText, queryByText } = await renderScreenAndWaitForLoad()

    const images = getAllByTestId('imageOption')
    fireEvent.press(images[0]!)
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

  it('should move a skipped word to the end of the stack to be tested again', async () => {
    const renderApi = await renderShortExerciseAndWaitForLoad()

    fireEvent.press(renderApi.getByTestId('button-skip'))
    Array.from({ length: shortVocabularyList.length - 1 }).forEach(() => answerCurrentWordCorrectly(renderApi))

    // Skipped "Spachtel" resurfaces as the final word, which can no longer be skipped
    expect(renderApi.getByText('Spachtel')).toBeVisible()
    expect(renderApi.queryByTestId('button-skip')).toBeNull()
  })

  it('should navigate to TrainingFinished after answering all words', async () => {
    const renderApi = await renderScreenAndWaitForLoad()

    Array.from({ length: MAX_TRAINING_REPETITIONS }).forEach(() => answerCurrentWordCorrectly(renderApi))

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'image',
        results: { correct: MAX_TRAINING_REPETITIONS, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })

  it('should pass correct answer count to TrainingFinished', async () => {
    const renderApi = await renderShortExerciseAndWaitForLoad()

    answerCurrentWordCorrectly(renderApi)
    failCurrentWordToMax(renderApi)
    failCurrentWordToMax(renderApi)

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'image',
        results: { correct: 1, total: shortVocabularyList.length },
        job: route.params.job,
      }),
    )
  })

  it('should not count answer as correct on second attempt', async () => {
    const renderApi = await renderShortExerciseAndWaitForLoad()
    const { getAllByTestId, getByText } = renderApi

    answerCurrentWordCorrectly(renderApi)

    // Answer the next word correctly only on the second try, so it doesn't get counted
    const images = getAllByTestId('imageOption')
    fireEvent.press(images[1]!)
    fireEvent.press(images[0]!)
    fireEvent.press(getByText(getLabels().exercises.continue))

    failCurrentWordToMax(renderApi)

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'image',
        results: { correct: 1, total: shortVocabularyList.length },
        job: route.params.job,
      }),
    )
  })

  it('should show continue instead of skip after the max number of incorrect attempts', async () => {
    const { getAllByTestId, getByText, queryByTestId } = await renderScreenAndWaitForLoad()

    // images[0] is the correct option (Math.random is mocked to 0), so repeatedly pick a wrong one
    const images = getAllByTestId('imageOption')
    for (let attempt = 0; attempt < NUMBER_OF_MAX_RETRIES; attempt += 1) {
      fireEvent.press(images[1]!)
    }

    expect(getByText(getLabels().exercises.continue)).toBeVisible()
    expect(queryByTestId('button-skip')).toBeNull()
  })

  it('should not count a word as correct once the max number of attempts is reached', async () => {
    const renderApi = await renderShortExerciseAndWaitForLoad()

    Array.from({ length: shortVocabularyList.length }).forEach(() => failCurrentWordToMax(renderApi))

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'image',
        results: { correct: 0, total: shortVocabularyList.length },
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
        src: state.vocabularyItems[state.currentVocabularyItemIndex]!.images[0]!,
        key: state.vocabularyItems[state.currentVocabularyItemIndex]!.id,
      })
      state = stateReducer(state, { type: 'nextWord' })
    }

    expect(state.completed).toBe(true)
  })

  it('should count correct answers', () => {
    let state = initializeState(vocabularyItems.slice())
    expect(state.correctAnswersCount).toBe(0)

    state = stateReducer(state, { type: 'selectAnswer', key: state.vocabularyItems[0]!.id })
    state = stateReducer(state, { type: 'nextWord' })
    expect(state.correctAnswersCount).toBe(1)

    state = stateReducer(state, { type: 'selectAnswer', key: state.vocabularyItems[0]!.id })
    state = stateReducer(state, { type: 'nextWord' })
    expect(state.correctAnswersCount).toBe(1)

    state = stateReducer(state, { type: 'selectAnswer', key: state.vocabularyItems[2]!.id })
    state = stateReducer(state, { type: 'nextWord' })
    expect(state.correctAnswersCount).toBe(2)
  })

  it('should finish with all words correct when cheating to succeed', async () => {
    const { getByText } = await renderInDevModeAndWaitForLoad()

    fireEvent.press(getByText(getLabels().exercises.cheat.succeed))

    await waitFor(() =>
      expect(navigation.replace).toHaveBeenCalledWith('TrainingFinished', {
        trainingType: 'image',
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
        trainingType: 'image',
        results: { correct: 0, total: MAX_TRAINING_REPETITIONS },
        job: route.params.job,
      }),
    )
  })
})
