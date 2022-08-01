import { CommonActions, RouteProp } from '@react-navigation/native'
import React from 'react'

import labels from '../../constants/labels.json'
import { RoutesParams } from '../../navigation/NavigationTypes'
import AsyncStorage from '../../services/AsyncStorage'
import DocumentBuilder from '../../testing/DocumentBuilder'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { mockUseLoadAsyncWithData } from '../../testing/mockUseLoadFromEndpoint'
import render from '../../testing/render'
import VocabularyListScreen from '../VocabularyListScreen'

jest.mock('../../components/FavoriteButton', () => {
  const Text = require('react-native').Text
  return () => <Text>FavoriteButton</Text>
})

jest.mock('../../services/AsyncStorage', () => ({
  setExerciseProgress: jest.fn(() => Promise.resolve()),
}))

jest.mock('../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

describe('VocabularyListScreen', () => {
  const documents = new DocumentBuilder(2).build()
  const route: RouteProp<RoutesParams, 'VocabularyList'> = {
    key: '',
    name: 'VocabularyList',
    params: {
      documents,
      disciplineId: 1,
      disciplineTitle: 'My discipline title',
      closeExerciseAction: CommonActions.goBack(),
    },
  }

  const navigation = createNavigationMock<'VocabularyList'>()

  it('should save progress', () => {
    render(<VocabularyListScreen route={route} navigation={navigation} />)
    expect(AsyncStorage.setExerciseProgress).toHaveBeenCalledWith(1, 0, 1)
  })

  it('should display vocabulary list', () => {
    mockUseLoadAsyncWithData(documents)

    const { getByText, getAllByText, getAllByTestId } = render(
      <VocabularyListScreen route={route} navigation={navigation} />
    )

    expect(getByText(labels.exercises.vocabularyList.title)).toBeTruthy()
    expect(getByText(`2 ${labels.general.words}`)).toBeTruthy()
    expect(getByText('der')).toBeTruthy()
    expect(getByText('Spachtel')).toBeTruthy()
    expect(getByText('das')).toBeTruthy()
    expect(getByText('Auto')).toBeTruthy()
    expect(getAllByText('AudioPlayer')).toHaveLength(2)
    expect(getAllByTestId('image')).toHaveLength(2)
  })
})
