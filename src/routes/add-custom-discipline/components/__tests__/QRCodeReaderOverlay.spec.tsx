import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Pressable, View } from 'react-native'

import render from '../../../../testing/render'
import QRCodeReaderOverlay from '../QRCodeReaderOverlay'

const apiCode = 'scanned-api-code'

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

jest.mock('react-native-camera', () => ({
  RNCamera: ({ onBarCodeRead }: { onBarCodeRead: ({ data }: { data: string }) => void }) => (
    <View accessibilityLabel='scanner'>
      <Pressable accessibilityLabel='mockOnBarCodeRead' onPress={() => onBarCodeRead({ data: apiCode })} />
    </View>
  ),
}))

describe('QRCodeReaderOverlay', () => {
  const setVisible = jest.fn()
  const setCode = jest.fn()

  it('should set text, when qr code is scanned', async () => {
    const { findByLabelText } = render(<QRCodeReaderOverlay setVisible={setVisible} setCode={setCode} />)
    const camera = await findByLabelText('mockOnBarCodeRead')
    expect(camera).toBeDefined()
    fireEvent.press(camera)
    expect(setVisible).toHaveBeenCalledWith(false)
    expect(setCode).toHaveBeenCalledWith(apiCode)
  })
})
