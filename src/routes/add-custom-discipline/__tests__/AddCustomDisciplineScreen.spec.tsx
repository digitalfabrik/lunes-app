import AsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import labels from '../../../constants/labels.json'
import { loadGroupInfo } from '../../../hooks/useLoadGroupInfo'
import AsyncStorageService from '../../../services/AsyncStorage'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import wrapWithTheme from '../../../testing/wrapWithTheme'
import AddCustomDisciplineScreen from '../AddCustomDisciplineScreen'

jest.mock('@react-navigation/native')
jest.mock('../../hooks/useLoadGroupInfo')

describe('AddCustomDisciplineScreen', () => {
  const navigation = createNavigationMock<'AddCustomDiscipline'>()

  it('should enable submit button on text input', async () => {
    const { findByText, findByPlaceholderText } = render(<AddCustomDisciplineScreen navigation={navigation} />, {
      wrapper: wrapWithTheme
    })
    const submitButton = await findByText(labels.addCustomDiscipline.submitLabel)
    expect(submitButton).toBeDisabled()
    const textField = await findByPlaceholderText(labels.addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'test')
    expect(submitButton).not.toBeDisabled()
  })

  it('should navigate on successfully submit', async () => {
    await AsyncStorageService.setCustomDisciplines(['test'])

    const groupInfo = {
      id: 1,
      icon: 'my_icon',
      title: 'Test',
      apiKey: 'my_api_key',
      isLeaf: false,
      parentTitle: null,
      numberOfChildren: 1,
      description: '',
      needsTrainingSetEndpoint: false
    }
    mocked(loadGroupInfo).mockImplementationOnce(async () => groupInfo)

    const { findByText, findByPlaceholderText } = render(<AddCustomDisciplineScreen navigation={navigation} />, {
      wrapper: wrapWithTheme
    })

    const textField = await findByPlaceholderText(labels.addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'another_test_module')
    const submitButton = await findByText(labels.addCustomDiscipline.submitLabel)
    fireEvent.press(submitButton)
    await waitFor(() =>
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('customDisciplines', '["test","another_test_module"]')
    )
    await waitFor(() => expect(navigation.navigate).toHaveBeenCalled())
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
    expect(await findByText(labels.addCustomDiscipline.error.alreadyAdded)).not.toBeNull()
  })

  it('should show wrong-code-error', async () => {
    const { findByText, getByText, findByPlaceholderText } = render(
      <AddCustomDisciplineScreen navigation={navigation} />,
      {
        wrapper: wrapWithTheme
      }
    )
    mocked(loadGroupInfo).mockRejectedValueOnce({ response: { status: 403 } })
    const textField = await findByPlaceholderText(labels.addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'invalid-code')
    const submitButton = getByText(labels.addCustomDiscipline.submitLabel)
    fireEvent.press(submitButton)
    expect(await findByText(labels.addCustomDiscipline.error.wrongCode)).not.toBeNull()
  })
})
