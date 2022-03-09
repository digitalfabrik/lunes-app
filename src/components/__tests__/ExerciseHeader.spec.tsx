import { RouteProp } from '@react-navigation/native'
import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'
// @ts-expect-error no type declarartions for BackHandler
// eslint-disable-next-line jest/no-mocks-import
import BackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler'

import labels from '../../constants/labels.json'
import { RoutesParams } from '../../navigation/NavigationTypes'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import ExerciseHeader from '../ExerciseHeader'

jest.useFakeTimers('modern')
jest.mock('react-native/Libraries/Utilities/BackHandler', () => BackHandler)

describe('ExerciseHeader', () => {
  const navigation = createNavigationMock<'WordChoiceExercise'>()
  const route: RouteProp<RoutesParams, 'WordChoiceExercise'> = {
    key: '',
    name: 'WordChoiceExercise',
    params: {
      discipline: {
        id: 1,
        title: 'TestTitel',
        numberOfChildren: 2,
        isLeaf: true,
        description: '',
        icon: '',
        parentTitle: 'parent',
        needsTrainingSetEndpoint: false
      }
    }
  }
  it('should render header', async () => {
    const { getByText, getByTestId } = render(
      <ExerciseHeader navigation={navigation} route={route} currentWord={4} numberOfWords={10} />
    )
    expect(getByTestId('modal')).toBeTruthy()
    expect(getByTestId('modal').props.visible).toBe(false)

    act(() => BackHandler.mockPressBack())

    expect(getByTestId('modal')).toBeTruthy()
    expect(getByTestId('modal').props.visible).toBe(true)
    expect(getByText(labels.exercises.cancelModal.cancelAsk)).toBeTruthy()
    expect(getByText(labels.exercises.cancelModal.cancel)).toBeTruthy()
    expect(getByText(labels.exercises.cancelModal.continue)).toBeTruthy()

    fireEvent.press(getByText(labels.exercises.cancelModal.cancel))

    expect(navigation.navigate).toHaveBeenCalledWith('Exercises', expect.any(Object))
  })
})
