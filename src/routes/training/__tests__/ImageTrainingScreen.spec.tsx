import { RouteProp } from '@react-navigation/native'
import { waitFor } from '@testing-library/react-native'
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
  const vocabularyItems = new VocabularyItemBuilder(8).build()
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
      },
    },
  }

  it('should render initially', async () => {
    mocked(getWordsByJob).mockReturnValue(Promise.resolve(vocabularyItems.slice()))
    const { getByText, getAllByTestId, getByTestId } = renderWithTheme(
      <ImageTrainingScreen navigation={navigation} route={route} />,
    )

    await waitFor(() => expect(getByText(getLabels().exercises.training.image.selectImage)).toBeVisible())
    expect(getAllByTestId('imageOption')).toHaveLength(4)

    const skipButton = getByTestId('button-skip')
    expect(skipButton).toBeVisible()
  })

  it('should correctly update the state', () => {
    let state = initializeState(vocabularyItems.slice())
    expect(state.vocabularyItems).toEqual(vocabularyItems.slice(0, 5))
    expect(state.vocabularyItems).toHaveLength(MAX_TRAINING_REPETITIONS)

    for (let i = 0; i < MAX_TRAINING_REPETITIONS; i += 1) {
      expect(state.completed).toBe(false)
      expect(state.currentIndex).toEqual(i)
      expect(state.correctAnswersCount).toBe(0)
      expect(state.choices).toContainEqual({
        src: state.vocabularyItems[state.currentIndex].images[0],
        key: state.vocabularyItems[state.currentIndex].id,
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
