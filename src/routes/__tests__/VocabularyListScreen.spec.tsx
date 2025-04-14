import { CommonActions, RouteProp } from '@react-navigation/native'
import React from 'react'

import { RoutesParams } from '../../navigation/NavigationTypes'
import { setExerciseProgress } from '../../services/AsyncStorage'
import { StorageCache } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { mockUseLoadAsyncWithData } from '../../testing/mockUseLoadFromEndpoint'
import { renderWithStorageCache } from '../../testing/render'
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

jest.mock('../../components/FeedbackBadge', () => () => null)

describe('VocabularyListScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(2).build()
  const route: RouteProp<RoutesParams, 'VocabularyList'> = {
    key: '',
    name: 'VocabularyList',
    params: {
      contentType: 'standard',
      vocabularyItems,
      disciplineId: 1,
      disciplineTitle: 'My discipline title',
      closeExerciseAction: CommonActions.goBack(),
    },
  }

  const navigation = createNavigationMock<'VocabularyList'>()
  const storageCache = StorageCache.createForTesting()

  it('should save progress', () => {
    renderWithStorageCache(storageCache, <VocabularyListScreen route={route} navigation={navigation} />)
    expect(setExerciseProgress).toHaveBeenCalledWith(storageCache, 1, 0, 1)
  })

  it('should display vocabulary list', () => {
    mockUseLoadAsyncWithData(vocabularyItems)

    const { getByText, getAllByText, getAllByTestId } = renderWithStorageCache(
      storageCache,
      <VocabularyListScreen route={route} navigation={navigation} />,
    )

    expect(getByText(getLabels().exercises.vocabularyList.title)).toBeTruthy()
    expect(getByText(`2 ${getLabels().general.words}`)).toBeTruthy()
    expect(getByText('der')).toBeTruthy()
    expect(getByText('Spachtel')).toBeTruthy()
    expect(getByText('das')).toBeTruthy()
    expect(getByText('Auto')).toBeTruthy()
    expect(getAllByText('AudioPlayer')).toHaveLength(2)
    expect(getAllByTestId('image')).toHaveLength(2)
  })
})
