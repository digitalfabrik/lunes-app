import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { Swipeable } from 'react-native-gesture-handler'
import { ReactTestInstance } from 'react-test-renderer'

import { DisciplineType } from '../../constants/endpoints'
import labels from '../../constants/labels.json'
import { ServerResponse } from '../../hooks/useLoadDisciplines'
import { ServerResponse as ServerResponseCustomDiscipline } from '../../hooks/useLoadGroupInfo'
import { useLoadGroupInfo } from '../../hooks/useLoadGroupInfo'
import useReadCustomDisciplines, { useReadFromAsyncStorage } from '../../hooks/useReadCustomDisciplines'
import AsyncStorageService from '../../services/AsyncStorage'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { mockUseLoadFromEndpointWithData } from '../../testing/mockUseLoadFromEndpoint'
import { mockUseLoadGroupInfo } from '../../testing/mockUseLoadGroupInfo'
import wrapWithTheme from '../../testing/wrapWithTheme'
import AddCustomDisciplineScreen from '../AddCustomDisciplineScreen'
import HomeScreen from '../HomeScreen'

const h = require('../../hooks/useReadCustomDisciplines')

jest.mock('@react-navigation/native')
/*jest.mock('../../hooks/useLoadGroupInfo', () => ({
  useLoadGroupInfo: () => [
    {
      title: 'custom discipline'
    }
  ]
}))*/

const mockDisciplines: ServerResponse[] = [
  {
    id: 1,
    title: 'First Discipline',
    description: 'Description1',
    icon: 'none',
    total_training_sets: 0,
    total_discipline_children: 1,
    total_documents: 0
  },
  {
    id: 2,
    title: 'Second Discipline',
    description: 'Description1',
    icon: 'none',
    total_training_sets: 0,
    total_discipline_children: 1,
    total_documents: 0
  }
]

const mockCustomDiscipline: DisciplineType = {
  id: 1,
  title: 'Custom Discipline',
  description: 'Description',
  icon: 'none',
  numberOfChildren: 1,
  isLeaf: false,
  apiKey: 'test'
}

describe('HomeScreen', () => {
  const navigation = createNavigationMock<'Home'>()

  it('should show discipline', async () => {
    mockUseLoadFromEndpointWithData(mockDisciplines)

    const { findByText } = render(<HomeScreen navigation={navigation} />, { wrapper: wrapWithTheme })
    expect(await findByText('First Discipline')).toBeDefined()
    expect(await findByText('Second Discipline')).toBeDefined()
  })

  it('should show custom discipline', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])
    mockUseLoadFromEndpointWithData(mockDisciplines)
    mockUseLoadGroupInfo(mockCustomDiscipline)

    const { findByText } = render(<HomeScreen navigation={navigation} />, { wrapper: wrapWithTheme })
    expect(await findByText('Custom Discipline')).toBeDefined()
  })

  it('should delete custom discipline', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])
    mockUseLoadFromEndpointWithData(mockDisciplines)
    mockUseLoadGroupInfo(mockCustomDiscipline)

    const { findByText, findByTestId } = render(<HomeScreen navigation={navigation} />, { wrapper: wrapWithTheme })
    const customDiscipline = await findByText('Custom Discipline')
    const eventData = {
      nativeEvent: {
        translationX: 200
      }
    }
    const row = await findByTestId('Swipeable')
    const swipeable = row.children[0] as ReactTestInstance
    fireEvent(customDiscipline, 'openRight', eventData)
    const deleteIcon = await findByTestId('trash-bin-icon')
    expect(deleteIcon).toBeDefined()
  })
})
