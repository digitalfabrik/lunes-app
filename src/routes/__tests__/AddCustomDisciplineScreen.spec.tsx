// import AsyncStorage from '@react-native-async-storage/async-storage'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import labels from '../../constants/labels.json'
import AsyncStorageService from '../../services/AsyncStorage'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { mockUseLoadFromEndpointWitData, mockUseLoadFromEndpointWithError } from '../../testing/mockUseLoadFromEndpoint'
import wrapWithTheme from '../../testing/wrapWithTheme'
import AddCustomDisciplineScreen from '../AddCustomDisciplineScreen'

jest.mock('@react-navigation/native')

describe('AddCustomDisciplineScreen', () => {
  const navigation = createNavigationMock<'AddCustomDiscipline'>()

  it('should change button to be enabled on text input', () => {
    mockUseLoadFromEndpointWithError('test')
    const { getByText, getByPlaceholderText } = render(<AddCustomDisciplineScreen navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    const submitButton = getByText(labels.addCustomDiscipline.submitLabel)
    expect(submitButton).toBeDisabled()
    const textField = getByPlaceholderText(labels.addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'test')
    expect(submitButton).not.toBeDisabled()
  })

  it('should navigate on successfully submit', async () => {
    mockUseLoadFromEndpointWitData([{ name: 'Test', numberOfChildren: 1 }])
    const { getByText, getByPlaceholderText } = render(<AddCustomDisciplineScreen navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    const textField = getByPlaceholderText(labels.addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'test')
    const submitButton = getByText(labels.addCustomDiscipline.submitLabel)
    fireEvent.press(submitButton)
    expect(AsyncStorage.setItem).toBeCalledWith('customDisciplines', '["test"]')
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalled())
  })

  it('should show duplicate error', async () => {
    mockUseLoadFromEndpointWithError('test')
    await AsyncStorageService.setCustomDisciplines(['test'])
    const { getByText, getByPlaceholderText, findByText } = render(
      <AddCustomDisciplineScreen navigation={navigation} />,
      {
        wrapper: wrapWithTheme
      }
    )
    await mocked(useIsFocused).mockReturnValue(true)
    await mocked(useIsFocused).mockReturnValue(false)

    const textField = getByPlaceholderText(labels.addCustomDiscipline.placeholder)
    await fireEvent.changeText(textField, 'test')
    const submitButton = getByText(labels.addCustomDiscipline.submitLabel)
    await fireEvent.press(submitButton)
    expect(await findByText(labels.addCustomDiscipline.error.alreadyAdded)).not.toBeNull()
  })
})
