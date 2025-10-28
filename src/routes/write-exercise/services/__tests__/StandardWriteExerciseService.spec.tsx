import { CommonActions, RouteProp } from '@react-navigation/native'
import { waitFor } from '@testing-library/react-native'
import React from 'react'

import { SIMPLE_RESULTS } from '../../../../constants/data'
import { VocabularyItem } from '../../../../constants/endpoints'
import { ContentType, RoutesParams, VocabularyItemResult } from '../../../../navigation/NavigationTypes'
import { StorageCache } from '../../../../services/Storage'
import { saveExerciseProgress } from '../../../../services/storageUtils'
import VocabularyItemBuilder from '../../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../../testing/createNavigationPropMock'
import StandardWriteExerciseService from '../StandardWriteExerciseService'

jest.mock('../../../../services/storageUtils', () => ({
  saveExerciseProgress: jest.fn(),
}))

describe('StandardWriteExerciseService', () => {
  let vocabularyItems: VocabularyItem[]
  let vocabularyItemsWithResults: VocabularyItemResult[]
  let service: StandardWriteExerciseService
  let route: RouteProp<RoutesParams, 'WriteExercise'>
  let storageCache: StorageCache
  const navigation = createNavigationMock<'WriteExercise'>()
  const setCurrentIndex: React.Dispatch<React.SetStateAction<number>> = jest.fn()
  const setIsAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>> = jest.fn()
  const setVocabularyItemWithResults: React.Dispatch<React.SetStateAction<VocabularyItemResult[]>> = jest.fn()
  const initTestData = (contentType: ContentType = 'standard') => {
    vocabularyItems = new VocabularyItemBuilder(4).build()
    vocabularyItemsWithResults = vocabularyItems.map(item => ({
      vocabularyItem: item,
      result: null,
      numberOfTries: 0,
    }))
    route = {
      key: '',
      name: 'WriteExercise',
      params: {
        contentType,
        vocabularyItems,
        unitId: { id: 1, type: 'standard' },
        unitTitle: 'TestTitel',
        closeExerciseAction: CommonActions.goBack(),
      },
    }
    storageCache = StorageCache.createDummy()
    service = new StandardWriteExerciseService(
      route,
      navigation,
      setCurrentIndex,
      setIsAnswerSubmitted,
      setVocabularyItemWithResults,
      storageCache,
    )
  }

  beforeEach(initTestData)

  describe('tryLater', () => {
    it('should move word to then end and change nothing else in the results', () => {
      service.tryLater(0, false, vocabularyItemsWithResults)
      expect(setVocabularyItemWithResults).toHaveBeenCalledWith([
        vocabularyItemsWithResults[1],
        vocabularyItemsWithResults[2],
        vocabularyItemsWithResults[3],
        vocabularyItemsWithResults[0],
      ])
    })
  })

  describe('continueExercise', () => {
    it('should unset isAnswerSubmitted', () => {
      vocabularyItemsWithResults[0].result = SIMPLE_RESULTS.correct
      vocabularyItemsWithResults[0].numberOfTries = 1
      service.continueExercise(0, false, vocabularyItemsWithResults, vocabularyItems, false)
      expect(setIsAnswerSubmitted).toHaveBeenCalledWith(false)
    })

    it('should update and push to end, if word needs repetition', () => {
      vocabularyItemsWithResults[0].result = SIMPLE_RESULTS.incorrect
      vocabularyItemsWithResults[0].numberOfTries = 1
      service.continueExercise(0, true, vocabularyItemsWithResults, vocabularyItems, false)
      expect(setVocabularyItemWithResults).toHaveBeenCalledWith([
        vocabularyItemsWithResults[1],
        vocabularyItemsWithResults[2],
        vocabularyItemsWithResults[3],
        vocabularyItemsWithResults[0],
      ])
    })

    it('should finish exercise with saving, if all words are done', async () => {
      await service.continueExercise(3, false, vocabularyItemsWithResults, vocabularyItems, false)
      expect(saveExerciseProgress).toHaveBeenCalledWith(
        storageCache,
        { id: 1, type: 'standard' },
        3,
        vocabularyItemsWithResults,
      )
      await waitFor(() => {
        expect(navigation.navigate).toHaveBeenCalled()
        expect(setCurrentIndex).toHaveBeenCalledWith(0)
      })
    })

    it('should finish exercise without saving, if all words are done and userVocabulary', async () => {
      initTestData('userVocabulary')
      await service.continueExercise(3, false, vocabularyItemsWithResults, vocabularyItems, false)
      expect(saveExerciseProgress).toHaveBeenCalledTimes(0)
      await waitFor(() => {
        expect(navigation.navigate).toHaveBeenCalled()
        expect(setCurrentIndex).toHaveBeenCalledWith(0)
      })
    })

    it('should go to next word, if no repetition needed', () => {
      vocabularyItemsWithResults[0].result = SIMPLE_RESULTS.correct
      vocabularyItemsWithResults[0].numberOfTries = 1
      service.continueExercise(0, false, vocabularyItemsWithResults, vocabularyItems, false)
      expect(setVocabularyItemWithResults).toHaveBeenCalledTimes(0)
      expect(setCurrentIndex).toHaveBeenCalled()
    })
  })

  describe('giveUp', () => {
    it('should be set to incorrect and not be repeated', () => {
      vocabularyItemsWithResults[0].result = SIMPLE_RESULTS.incorrect
      vocabularyItemsWithResults[0].numberOfTries = 0
      service.giveUp(vocabularyItemsWithResults, vocabularyItemsWithResults[0], 0)
      expect(setVocabularyItemWithResults).toHaveBeenCalledWith([
        {
          ...vocabularyItemsWithResults[0],
          numberOfTries: 1,
        },
        vocabularyItemsWithResults[1],
        vocabularyItemsWithResults[2],
        vocabularyItemsWithResults[3],
      ])
    })
  })
})
