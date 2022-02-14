import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'
import { TouchableOpacity, View } from 'react-native'

import wrapWithTheme from '../../../../testing/wrapWithTheme'
import QRCodeReaderOverlay from '../QRCodeReaderOverlay'

const apiCode = 'scanned-api-code'

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
    const { getByTestId, queryByTestId } = render(<QRCodeReaderOverlay setVisible={setVisible} setCode={setCode} />, {
      wrapper: wrapWithTheme
    })
    const closeIcon = getByTestId('close-circle-icon-white')
    expect(closeIcon).toBeDefined()
    fireEvent(closeIcon, 'onPressIn')
    expect(getByTestId('close-circle-icon-blue')).toBeDefined()
    expect(queryByTestId('close-circle-icon-white')).toBeNull()
  })

  it('should set text, when qr code is scanned', () => {
    const { getByLabelText } = render(<QRCodeReaderOverlay setVisible={setVisible} setCode={setCode} />, {
      wrapper: wrapWithTheme
    })
    const camera = getByLabelText('mockOnBarCodeRead')
    expect(camera).toBeDefined()
    fireEvent.press(camera)
    expect(setVisible).toHaveBeenCalledWith(false)
    expect(setCode).toHaveBeenCalledWith(apiCode)
  })
})
