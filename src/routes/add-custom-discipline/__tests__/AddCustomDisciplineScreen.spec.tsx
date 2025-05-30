import RNAsyncStorage from '@react-native-async-storage/async-storage'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'
import { View } from 'react-native'
import { Code } from 'react-native-vision-camera'

import { loadDiscipline } from '../../../hooks/useLoadDiscipline'
import { StorageCache } from '../../../services/Storage'
import { getLabels } from '../../../services/helpers'
import createNavigationMock from '../../../testing/createNavigationPropMock'
import { mockDisciplines } from '../../../testing/mockDiscipline'
import render, { renderWithStorageCache } from '../../../testing/render'
import AddCustomDisciplineScreen from '../AddCustomDisciplineScreen'

jest.mock('@react-navigation/native')
jest.mock('../../../hooks/useLoadDiscipline')

type OnCodeScanned = (codes: Code[]) => Code[]
jest.mock('react-native-vision-camera', () => ({
  Camera: () => <View accessibilityLabel='RNCamera' />,
  useCameraDevice: () => ({ id: 'device1' }),
  useCodeScanner: ({ onCodeScanned }: { onCodeScanned: OnCodeScanned }) => ({ onCodeScanned }),
}))

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

describe('AddCustomDisciplineScreen', () => {
  const navigation = createNavigationMock<'AddCustomDiscipline'>()
  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
  })

  it('should enable submit button on text input', async () => {
    const { findByText, findByPlaceholderText } = renderWithStorageCache(
      storageCache,
      <AddCustomDisciplineScreen navigation={navigation} />,
    )
    const submitButton = await findByText(getLabels().addCustomDiscipline.submitLabel)
    expect(submitButton).toBeDisabled()
    const textField = await findByPlaceholderText(getLabels().addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'test')
    expect(submitButton).not.toBeDisabled()
  })

  it('should navigate on successfully submit', async () => {
    await storageCache.setItem('customDisciplines', ['test'])

    mocked(loadDiscipline).mockImplementationOnce(async () => mockDisciplines()[0])

    const { findByText, findByPlaceholderText } = renderWithStorageCache(
      storageCache,
      <AddCustomDisciplineScreen navigation={navigation} />,
    )

    const textField = await findByPlaceholderText(getLabels().addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'another_test_discipline')
    const submitButton = await findByText(getLabels().addCustomDiscipline.submitLabel)
    fireEvent.press(submitButton)
    await waitFor(() =>
      expect(RNAsyncStorage.setItem).toHaveBeenCalledWith('customDisciplines', '["test","another_test_discipline"]'),
    )
    await waitFor(() => expect(navigation.goBack).toHaveBeenCalled())
  })

  it('should show duplicate error', async () => {
    await storageCache.setItem('customDisciplines', ['test'])
    const { findByText, findByPlaceholderText } = renderWithStorageCache(
      storageCache,
      <AddCustomDisciplineScreen navigation={navigation} />,
    )

    const textField = await findByPlaceholderText(getLabels().addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'test')
    const submitButton = await findByText(getLabels().addCustomDiscipline.submitLabel)
    fireEvent.press(submitButton)
    expect(await findByText(getLabels().addCustomDiscipline.error.alreadyAdded)).not.toBeNull()
  })

  it('should show wrong-code-error', async () => {
    const { findByText, getByText, findByPlaceholderText } = render(
      <AddCustomDisciplineScreen navigation={navigation} />,
    )
    mocked(loadDiscipline).mockRejectedValueOnce({ response: { status: 403 } })
    const textField = await findByPlaceholderText(getLabels().addCustomDiscipline.placeholder)
    fireEvent.changeText(textField, 'invalid-code')
    const submitButton = getByText(getLabels().addCustomDiscipline.submitLabel)
    fireEvent.press(submitButton)
    expect(await findByText(getLabels().addCustomDiscipline.error.wrongCode)).not.toBeNull()
  })

  it('should open qr code scanner', async () => {
    const { findByLabelText } = render(<AddCustomDisciplineScreen navigation={navigation} />)
    const QRCodeIcon = await findByLabelText('qr-code-scanner')
    expect(QRCodeIcon).toBeDefined()
    fireEvent.press(QRCodeIcon)
    expect(await findByLabelText('RNCamera')).toBeDefined()
  })
})
