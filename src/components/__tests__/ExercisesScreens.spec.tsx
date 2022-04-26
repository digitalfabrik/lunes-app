import { RouteProp } from '@react-navigation/native'
import { fireEvent, render, RenderAPI } from '@testing-library/react-native'
import React from 'react'

import { RoutesParams } from '../../navigation/NavigationTypes'
import ExerciseScreen from '../../routes/ExercisesScreens'
import createNavigationMock from '../../testing/createNavigationPropMock'

describe('ExercisesScreen', () => {
  const onPress = jest.fn()
  const navigation = createNavigationMock<'Exercises'>()
  const route: RouteProp<RoutesParams, 'Exercises'> = {
    key: '',
    name: 'Exercises',
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
  const renderExersiseScreen = (): RenderAPI => render(<ExerciseScreen route={route} navigation={navigation} />)

  it('should display modal on listItem click', () => {
    const { getByText, getByTestId } = renderExersiseScreen()
    const wordList = getByText('Wortliste')
    fireEvent(wordList, 'pressIn', { nativeEvent: { pageY: 123 } })
    expect(onPress).toHaveBeenCalled()
    // changing currentLevel??
    const modal = getByTestId('modal')
    expect(modal).toBeDefined()
  })
})
