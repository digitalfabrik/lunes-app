import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'

import labels from '../../constants/labels.json'
import AsyncStorageService from '../../services/AsyncStorage'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { mockUseLoadFromEndpointWitData } from '../../testing/mockUseLoadFromEndpoint'
import wrapWithTheme from '../../testing/wrapWithTheme'
import AddCustomDisciplineScreen from '../AddCustomDisciplineScreen'

jest.mock('@react-navigation/native')

describe('AddCustomDisciplineScreen', () => {
  const navigation = createNavigationMock<'AddCustomDiscipline'>()

  it('should change button to be enabled on text input', () => {
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
    await AsyncStorageService.setCustomDisciplines(['test'])

    const { getByText, getByPlaceholderText } = render(<AddCustomDisciplineScreen navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    const textField = getByPlaceholderText(labels.addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'another_test_module')
    const submitButton = getByText(labels.addCustomDiscipline.submitLabel)
    fireEvent.press(submitButton)
    await waitFor(() =>
      expect(AsyncStorage.setItem).toBeCalledWith('customDisciplines', '["test","another_test_module"]')
    )
    expect(navigation.navigate).toHaveBeenCalled()
  })

  it('should show duplicate error', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])
    const { findByText, findByPlaceholderText } = render(<AddCustomDisciplineScreen navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    const textField = await findByPlaceholderText(labels.addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'test')
    const submitButton = await findByText(labels.addCustomDiscipline.submitLabel)
    fireEvent.press(submitButton)
    await waitFor(() => expect(findByText(labels.addCustomDiscipline.error.alreadyAdded)).not.toBeNull())
  })
})
