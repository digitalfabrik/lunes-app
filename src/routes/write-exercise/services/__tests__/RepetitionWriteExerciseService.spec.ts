import { CommonActions, RouteProp } from '@react-navigation/native'
import { waitFor } from '@testing-library/react-native'
import React from 'react'

import { SIMPLE_RESULTS } from '../../../../constants/data'
import { VocabularyItem } from '../../../../constants/endpoints'
import { RoutesParams, VocabularyItemResult } from '../../../../navigation/NavigationTypes'
import { RepetitionService } from '../../../../services/RepetitionService'
import { StorageCache } from '../../../../services/Storage'
import VocabularyItemBuilder from '../../../../testing/VocabularyItemBuilder'
import createNavigationMock from '../../../../testing/createNavigationPropMock'
import RepetitionWriteExerciseService from '../RepetitionWriteExerciseService'

jest.mock('../../../../services/storageUtils', () => ({
  saveExerciseProgress: jest.fn(),
}))

describe('RepetitionWriteExerciseService', () => {
  let vocabularyItems: VocabularyItem[]
  let vocabularyItemsWithResults: VocabularyItemResult[]
  let service: RepetitionWriteExerciseService
  let route: RouteProp<RoutesParams, 'WriteExercise'>
  let storageCache: StorageCache
  let repetitionService: RepetitionService

  const navigation = createNavigationMock<'WriteExercise'>()
  const setCurrentIndex: React.Dispatch<React.SetStateAction<number>> = jest.fn()
  const setIsAnswerSubmitted: React.Dispatch<React.SetStateAction<boolean>> = jest.fn()
  const setVocabularyItemWithResults: React.Dispatch<React.SetStateAction<VocabularyItemResult[]>> = jest.fn()

  const initTestData = () => {
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
        contentType: 'repetition',
        vocabularyItems,
        unitTitle: 'TestTitel',
        closeExerciseAction: CommonActions.goBack(),
      },
    }
    storageCache = StorageCache.createDummy()
    service = new RepetitionWriteExerciseService(
      route,
      navigation,
      setCurrentIndex,
      setIsAnswerSubmitted,
      setVocabularyItemWithResults,
      storageCache,
    )
    repetitionService = service.repetitionService
    repetitionService.moveWordToPreviousSection = jest.fn()
    repetitionService.updateWordNodeCard = jest.fn()
  }

  beforeEach(initTestData)

  describe('tryLater', () => {
    it('should move word to then end and change nothing else in the results nor the nodeCards', () => {
      service.tryLater(0, false, vocabularyItemsWithResults)
      expect(setVocabularyItemWithResults).toHaveBeenCalledWith([
        vocabularyItemsWithResults[1],
        vocabularyItemsWithResults[2],
        vocabularyItemsWithResults[3],
        vocabularyItemsWithResults[0],
      ])
      expect(repetitionService.moveWordToPreviousSection).not.toHaveBeenCalled()
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

    it('should finish exercise, if all words are done', async () => {
      await service.continueExercise(3, false, vocabularyItemsWithResults, vocabularyItems, false)
      expect(navigation.navigate).toHaveBeenCalled()
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
    it('should be set to incorrect and not be repeated', async () => {
      vocabularyItemsWithResults[0].result = SIMPLE_RESULTS.incorrect
      vocabularyItemsWithResults[0].numberOfTries = 0
      await service.giveUp(vocabularyItemsWithResults, vocabularyItemsWithResults[0], 0)
      await waitFor(() =>
        expect(setVocabularyItemWithResults).toHaveBeenCalledWith([
          {
            ...vocabularyItemsWithResults[0],
            numberOfTries: 1,
          },
          vocabularyItemsWithResults[1],
          vocabularyItemsWithResults[2],
          vocabularyItemsWithResults[3],
        ]),
      )
      await waitFor(() =>
        expect(repetitionService.updateWordNodeCard).toHaveBeenCalledWith({
          ...vocabularyItemsWithResults[0],
          numberOfTries: 1,
        }),
      )
    })
  })
})
