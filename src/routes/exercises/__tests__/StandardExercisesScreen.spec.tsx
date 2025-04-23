import RNAsyncStorage from '@react-native-async-storage/async-storage'
import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { EXERCISES, SCORE_THRESHOLD_POSITIVE_FEEDBACK } from '../../../constants/data'
import useLoadVocabularyItems from '../../../hooks/useLoadVocabularyItems'
import { RoutesParams } from '../../../navigation/NavigationTypes'
import { StorageCache } from '../../../services/Storage'
import VocabularyItemBuilder from '../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { getReturnOf } from '../../../testing/helper'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import { renderWithStorageCache } from '../../../testing/render'
import StandardExercisesScreen from '../StandardExercisesScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadVocabularyItems')

describe('StandardExercisesScreen', () => {
  const vocabularyItems = new VocabularyItemBuilder(1).build()
  let storageCache: StorageCache

  const navigation = createNavigationMock<'StandardExercises'>()
  const route: RouteProp<RoutesParams, 'StandardExercises'> = {
    key: 'key-0',
    name: 'StandardExercises',
    params: {
      contentType: 'standard',
      disciplineId: mockDisciplines()[0].id,
      disciplineTitle: mockDisciplines()[0].title,
      discipline: mockDisciplines()[0],
      vocabularyItems: null,
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
    RNAsyncStorage.clear()
    storageCache = StorageCache.createDummy()
    storageCache.setItem('progress', {
      [route.params.disciplineId]: {
        '0': SCORE_THRESHOLD_POSITIVE_FEEDBACK - 1,
        '1': SCORE_THRESHOLD_POSITIVE_FEEDBACK + 1,
      },
    })
    mocked(useLoadVocabularyItems).mockReturnValue(getReturnOf(vocabularyItems))
  })

  it('should render correctly', () => {
    const { getAllByText } = renderWithStorageCache(
      storageCache,
      <StandardExercisesScreen route={route} navigation={navigation} />,
    )
    EXERCISES.forEach(exercise => {
      expect(getAllByText(exercise.title)).toBeDefined()
      expect(getAllByText(exercise.description)).toBeDefined()
    })
  })

  it('should show modal that the lesson is not available yet on navigation if locked', async () => {
    await storageCache.setItem('progress', {})
    const { getByText, getByTestId, queryByTestId } = renderWithStorageCache(
      storageCache,
      <StandardExercisesScreen route={route} navigation={navigation} />,
    )
    expect(queryByTestId('locking-modal')).toBeFalsy()
    const lockedExercise = getByText(EXERCISES[1].title)
    fireEvent.press(lockedExercise)
    await waitFor(() => expect(getByTestId('locking-modal')).toHaveProp('visible', true))
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('should trigger navigation if unlocked', () => {
    const { getByText } = renderWithStorageCache(
      storageCache,
      <StandardExercisesScreen route={route} navigation={navigation} />,
    )
    const nextExercise = getByText(EXERCISES[0].title)
    fireEvent.press(nextExercise)
    expect(navigation.navigate).toHaveBeenCalledWith(EXERCISES[0].screen, {
      contentType: 'standard',
      closeExerciseAction: undefined,
      disciplineId: mockDisciplines()[0].id,
      disciplineTitle: mockDisciplines()[0].title,
      vocabularyItems,
    })
  })

  it('should show feedback badge for done levels', async () => {
    const { queryByTestId } = renderWithStorageCache(
      storageCache,
      <StandardExercisesScreen route={route} navigation={navigation} />,
    )
    await waitFor(() => expect(queryByTestId('positive-badge')).not.toBeNull())
  })

  it('should not show feedback badge for wordlist level', async () => {
    const { queryByTestId } = renderWithStorageCache(
      storageCache,
      <StandardExercisesScreen route={route} navigation={navigation} />,
    )
    await waitFor(() => expect(queryByTestId('negative-badge')).toBeNull())
  })
})
