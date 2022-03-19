import { RouteProp } from '@react-navigation/native'
import { act, fireEvent } from '@testing-library/react-native'
import React from 'react'
// @ts-expect-error no type declarations for BackHandler
// eslint-disable-next-line jest/no-mocks-import
import BackHandler from 'react-native/Libraries/Utilities/__mocks__/BackHandler'

import { Document } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import { RoutesParams } from '../../navigation/NavigationTypes'
import createNavigationMock from '../../testing/createNavigationPropMock'
import render from '../../testing/render'
import ExerciseHeader from '../ExerciseHeader'

jest.useFakeTimers('modern')
jest.mock('react-native/Libraries/Utilities/BackHandler', () => BackHandler)

describe('ExerciseHeader', () => {
  const navigation = createNavigationMock<'WordChoiceExercise'>()
  const documents: Document[] = [
    {
      audio: '',
      word: 'Helm',
      id: 1,
      article: {
        id: 1,
        value: 'Der'
      },
      document_image: [{ id: 1, image: 'Helm' }],
      alternatives: []
    },
    {
      audio: '',
      word: 'Auto',
      id: 2,
      article: {
        id: 3,
        value: 'Das'
      },
      document_image: [{ id: 2, image: 'Auto' }],
      alternatives: []
    }
  ]
  const route: RouteProp<RoutesParams, 'WordChoiceExercise'> = {
    key: '',
    name: 'WordChoiceExercise',
    params: {
      documents,
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

    act(BackHandler.mockPressBack)

    expect(getByTestId('modal')).toBeTruthy()
    expect(getByTestId('modal').props.visible).toBe(true)
    expect(getByText(labels.exercises.cancelModal.cancelAsk)).toBeTruthy()
    expect(getByText(labels.exercises.cancelModal.cancel)).toBeTruthy()
    expect(getByText(labels.exercises.cancelModal.continue)).toBeTruthy()

    fireEvent.press(getByText(labels.exercises.cancelModal.cancel))

    expect(navigation.goBack).toHaveBeenCalled()
  })
})
