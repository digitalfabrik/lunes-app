import { RouteProp } from '@react-navigation/native'
import React from 'react'

import { ExerciseKeys } from '../../constants/data'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { trackEvent } from '../../services/AnalyticsService'
import { StorageCache } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import { setExerciseProgress } from '../../services/storageUtils'
import VocabularyItemBuilder from '../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { mockUseLoadAsyncWithData } from '../../testing/mockUseLoadFromEndpoint'
import { renderWithStorageCache } from '../../testing/render'
import VocabularyListScreen from '../VocabularyListScreen'

jest.mock('../../components/FavoriteButton', () => {
  const Text = require('react-native').Text
  return () => <Text>FavoriteButton</Text>
})

jest.mock('../../services/storageUtils', () => ({
  setExerciseProgress: jest.fn(() => Promise.resolve()),
}))

jest.mock('../../components/AudioPlayer', () => {
  const Text = require('react-native').Text
  return () => <Text>AudioPlayer</Text>
})

jest.mock('../../components/FeedbackBadge', () => () => null)

jest.mock('../../services/AnalyticsService', () => ({
  trackEvent: jest.fn(),
}))

jest.mock('../../services/SessionService', () => ({
  getCurrentSessionId: jest.fn(() => 'test-session-id'),
}))

describe('VocabularyListScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(2).build()
  const route: RouteProp<RoutesParams, 'VocabularyList'> = {
    key: '',
    name: 'VocabularyList',
    params: {
      contentType: 'standard',
      vocabularyItems,
      unitId: { id: 1, type: 'standard' },
      unitTitle: 'My unit title',
    },
  }

  const navigation = createNavigationMock<'VocabularyList'>()
  const storageCache = StorageCache.createDummy()

  it('should save progress', () => {
    renderWithStorageCache(storageCache, <VocabularyListScreen route={route} navigation={navigation} />)
    expect(setExerciseProgress).toHaveBeenCalledWith(
      storageCache,
      { id: 1, type: 'standard' },
      ExerciseKeys.vocabularyList,
      1,
    )
  })

  it('should display vocabulary list', () => {
    mockUseLoadAsyncWithData(vocabularyItems)

    const { getByText, getAllByText, getAllByTestId } = renderWithStorageCache(
      storageCache,
      <VocabularyListScreen route={route} navigation={navigation} />,
    )

    expect(getByText('My unit title')).toBeTruthy()
    expect(getByText(`2 ${getLabels().general.word.plural}`)).toBeTruthy()
    expect(getByText('der')).toBeTruthy()
    expect(getByText('Spachtel')).toBeTruthy()
    expect(getByText('das')).toBeTruthy()
    expect(getByText('Auto')).toBeTruthy()
    expect(getAllByText('AudioPlayer')).toHaveLength(2)
    expect(getAllByTestId('image')).toHaveLength(2)
  })

  it('should track module duration on unmount', () => {
    const { unmount } = renderWithStorageCache(
      storageCache,
      <VocabularyListScreen route={route} navigation={navigation} />,
    )

    expect(trackEvent).not.toHaveBeenCalledWith(storageCache, expect.objectContaining({ type: 'module_duration' }))
    unmount()
    expect(trackEvent).toHaveBeenCalledWith(storageCache, {
      type: 'module_duration',
      duration_seconds: expect.any(Number),
      unit_id: 1,
      exercise_type: ExerciseKeys.vocabularyList,
    })
  })
})
