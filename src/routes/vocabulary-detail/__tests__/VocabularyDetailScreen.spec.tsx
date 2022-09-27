import { CommonActions, RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { RoutesParams } from '../../../navigation/NavigationTypes'
import { getLabels } from '../../../services/helpers'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import render from '../../../testing/render'
import VocabularyDetailScreen from '../VocabularyDetailScreen'

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
  const documents = new VocabularyItemBuilder(2).build() // TODO : ROUTIN

  const getRoute = (documentIndex: number): RouteProp<RoutesParams, 'VocabularyDetail'> => ({
    key: '',
    name: 'VocabularyDetail',
    params: {
      disciplineId: 1,
      disciplineTitle: 'disciplineTitle',
      documents,
      closeExerciseAction: CommonActions.goBack(),
      documentIndex,
    },
  })

  const navigation = createNavigationMock<'VocabularyDetail'>()

  it('should render and navigate to next word', () => {
    const { getByText } = render(<VocabularyDetailScreen route={getRoute(0)} navigation={navigation} />)
    expect(getByText(documents[0].word)).toBeDefined()
    expect('AudioPlayer').toBeDefined()
    expect('FavoriteButton').toBeDefined()
    expect(getByText(getLabels().exercises.vocabularyList.alternativeWords)).toBeDefined()
    const button = getByText(getLabels().exercises.next)
    fireEvent.press(button)
    expect(navigation.navigate).toHaveBeenCalledWith('VocabularyDetail', { ...getRoute(1).params })
  })
})
