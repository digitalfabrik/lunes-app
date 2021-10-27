import AsyncStorage from '@react-native-async-storage/async-storage'
import { useIsFocused } from '@react-navigation/native'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import React from 'react'
import { mocked } from 'ts-jest/utils'

import labels from '../../constants/labels.json'
import createNavigationMock from '../../testing/createNavigationPropMock'
import wrapWithTheme from '../../testing/wrapWithTheme'
import AddCustomDisciplineScreen from '../AddCustomDisciplineScreen'

jest.mock('@react-navigation/native')
jest.mock('../../hocs/withCustomDisciplines')

describe('AddCustomDisciplineScreen', () => {
  const navigation = createNavigationMock<'AddCustomDiscipline'>()

  it('Should change button to be enabled on text input', () => {
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

  it('should show duplicate error', () => {
    const { getByText, getByPlaceholderText } = render(<AddCustomDisciplineScreen navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    mocked(useIsFocused).mockReturnValue(true)
    mocked(useIsFocused).mockReturnValue(false)

    const textField = getByPlaceholderText(labels.addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'test')
    const submitButton = getByText(labels.addCustomDiscipline.submitLabel)
    fireEvent.press(submitButton)
    expect(getByText(labels.addCustomDiscipline.error.alreadyAdded)).not.toBeNull()
  })
})
