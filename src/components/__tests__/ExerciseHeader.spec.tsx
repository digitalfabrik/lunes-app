import { CommonActions } from '@react-navigation/native'
import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'
// @ts-expect-error no type declarations for BackHandler
// eslint-disable-next-line jest/no-mocks-import
import BackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler'

import { ExerciseKeys } from '../../constants/data'
import { VocabularyItemTypes } from '../../models/VocabularyItem'
import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import ExerciseHeader from '../ExerciseHeader'

jest.useFakeTimers()
jest.mock('react-native/Libraries/Utilities/BackHandler', () => BackHandler)
jest.mock('../AudioPlayer', () => () => null)

describe('ExerciseHeader', () => {
  const navigation = createNavigationMock<'WordChoiceExercise'>()

  it('should render header', () => {
    const goBack = CommonActions.goBack()
    const { getByText, getByTestId, queryByTestId } = render(
      <ExerciseHeader
        navigation={navigation}
        currentWord={4}
        numberOfWords={10}
        closeExerciseAction={goBack}
        feedbackTarget={{ type: 'word', wordId: { type: VocabularyItemTypes.Standard, id: 1 } }}
        exerciseKey={ExerciseKeys.vocabularyList}
      />,
    )
    expect(queryByTestId('customModal')).toBeFalsy()

    act(BackHandler.mockPressBack)

    expect(getByTestId('customModal')).toBeTruthy()
    expect(getByTestId('customModal').props.visible).toBe(true)
    expect(getByText(getLabels().exercises.cancelModal.cancelAsk)).toBeTruthy()
    expect(getByText(getLabels().exercises.cancelModal.cancel)).toBeTruthy()
    expect(getByText(getLabels().general.back)).toBeTruthy()

    fireEvent.press(getByText(getLabels().exercises.cancelModal.cancel))

    expect(navigation.dispatch).toHaveBeenCalledWith(goBack)
  })
})
