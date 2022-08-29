import { CommonActions } from '@react-navigation/native'
import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'
// @ts-expect-error no type declarations for BackHandler
// eslint-disable-next-line jest/no-mocks-import
import BackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler'

import { FeedbackType } from '../../constants/data'
import labels from '../../constants/labels.json'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import ExerciseHeader from '../ExerciseHeader'

jest.useFakeTimers()
jest.mock('react-native/Libraries/Utilities/BackHandler', () => BackHandler)

describe('ExerciseHeader', () => {
  const navigation = createNavigationMock<'WordChoiceExercise'>()

  it('should render header', () => {
    const goBack = CommonActions.goBack()
    const { getByText, getByTestId } = render(
      <ExerciseHeader
        navigation={navigation}
        currentWord={4}
        numberOfWords={10}
        closeExerciseAction={goBack}
        feedbackType={FeedbackType.document}
        feedbackForId={1}
      />
    )
    expect(getByTestId('customModal')).toBeTruthy()
    expect(getByTestId('customModal').props.visible).toBe(false)

    act(BackHandler.mockPressBack)

    expect(getByTestId('customModal')).toBeTruthy()
    expect(getByTestId('customModal').props.visible).toBe(true)
    expect(getByText(labels.exercises.cancelModal.cancelAsk)).toBeTruthy()
    expect(getByText(labels.exercises.cancelModal.cancel)).toBeTruthy()
    expect(getByText(labels.general.back)).toBeTruthy()

    fireEvent.press(getByText(labels.exercises.cancelModal.cancel))

    expect(navigation.dispatch).toHaveBeenCalledWith(goBack)
  })
})
