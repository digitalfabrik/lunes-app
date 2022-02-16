import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import render from '../../../../testing/render'
import QRCodeReaderOverlay from '../QRCodeReaderOverlay'

const apiCode = 'scanned-api-code'

jest.mock('react-native//Libraries/PermissionsAndroid/PermissionsAndroid', () => ({
  ...jest.requireActual('react-native//Libraries/PermissionsAndroid/PermissionsAndroid'),
  request: jest.fn(() => new Promise(resolve => resolve('granted')))
}))

jest.mock('react-native-camera', () => ({
  RNCamera: ({ onBarCodeRead }: { onBarCodeRead: ({ data }: { data: string }) => void }) => (
    <View accessibilityLabel='scanner'>
      <TouchableOpacity accessibilityLabel='mockOnBarCodeRead' onPress={() => onBarCodeRead({ data: apiCode })} />
    </View>
  )
}))

describe('QRCodeReaderOverlay', () => {
  const setVisible = jest.fn()
  const setCode = jest.fn()

  it('should show close header with correct icon', () => {
    const { getByTestId, queryByTestId } = render(<QRCodeReaderOverlay setVisible={setVisible} setCode={setCode} />)
    const closeIcon = getByTestId('close-circle-icon-white')
    expect(closeIcon).toBeDefined()
    fireEvent(closeIcon, 'onPressIn')
    expect(getByTestId('close-circle-icon-blue')).toBeDefined()
    expect(queryByTestId('close-circle-icon-white')).toBeNull()
  })

  it('should close overlay on icon press', () => {
    const { getByTestId } = render(<QRCodeReaderOverlay setVisible={setVisible} setCode={setCode} />)
    const closeIcon = getByTestId('close-circle-icon-white')
    expect(closeIcon).toBeDefined()
    fireEvent.press(closeIcon)
    expect(setVisible).toHaveBeenCalledWith(false)
  })

  it('should set text, when qr code is scanned', async () => {
    const { findByLabelText } = render(<QRCodeReaderOverlay setVisible={setVisible} setCode={setCode} />)
    const camera = await findByLabelText('mockOnBarCodeRead')
    expect(camera).toBeDefined()
    fireEvent.press(camera)
    expect(setVisible).toHaveBeenCalledWith(false)
    expect(setCode).toHaveBeenCalledWith(apiCode)
  })
})
