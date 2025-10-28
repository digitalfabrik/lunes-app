import { CommonActions, RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import VocabularyDetailExerciseScreen from '../VocabularyDetailExerciseScreen'

jest.useFakeTimers()

jest.mock('../../../components/FavoriteButton', () => {
  const Text = require('react-native').Text
  return () => <Text>FavoriteButton</Text>
})

jest.mock('../../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('VocabularyDetailScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(2).build()

  const getRoute = (vocabularyItemIndex: number): RouteProp<RoutesParams, 'VocabularyDetailExercise'> => ({
    key: '',
    name: 'VocabularyDetailExercise',
    params: {
      contentType: 'standard',
      unitId: { id: 1, type: 'standard' },
      unitTitle: 'disciplineTitle',
      vocabularyItems,
      closeExerciseAction: CommonActions.goBack(),
      vocabularyItemIndex,
    },
  })

  const navigation = createNavigationMock<'VocabularyDetailExercise'>()

  it('should render and navigate to next word', () => {
    const { getByText } = render(<VocabularyDetailExerciseScreen route={getRoute(0)} navigation={navigation} />)
    expect(getByText(vocabularyItems[0].word)).toBeDefined()
    expect('AudioPlayer').toBeDefined()
    expect('FavoriteButton').toBeDefined()
    expect(getByText(getLabels().exercises.vocabularyList.alternativeWords)).toBeDefined()
    const button = getByText(getLabels().exercises.next)
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith('VocabularyDetailExercise', { ...getRoute(1).params })
  })
})
