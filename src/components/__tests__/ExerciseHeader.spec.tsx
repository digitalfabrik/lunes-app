import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'
// @ts-expect-error no type declarations for BackHandler
// eslint-disable-next-line jest/no-mocks-import
import BackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler'

import labels from '../../constants/labels.json'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import ExerciseHeader from '../ExerciseHeader'

jest.useFakeTimers('modern')
jest.mock('react-native/Libraries/Utilities/BackHandler', () => BackHandler)

describe('ExerciseHeader', () => {
  const navigation = createNavigationMock<'WordChoiceExercise'>()

  it('should render header', () => {
    const { getByText, getByTestId } = render(
      <ExerciseHeader navigation={navigation} currentWord={4} numberOfWords={10} />
    )
    expect(getByTestId('confirmationModal')).toBeTruthy()
    expect(getByTestId('confirmationModal').props.visible).toBe(false)

    act(BackHandler.mockPressBack)

    expect(getByTestId('confirmationModal')).toBeTruthy()
    expect(getByTestId('confirmationModal').props.visible).toBe(true)
    expect(getByText(labels.exercises.cancelModal.cancelAsk)).toBeTruthy()
    expect(getByText(labels.exercises.cancelModal.cancel)).toBeTruthy()
    expect(getByText(labels.exercises.cancelModal.continue)).toBeTruthy()

    fireEvent.press(getByText(labels.exercises.cancelModal.cancel))

    expect(navigation.goBack).toHaveBeenCalled()
  })
})
