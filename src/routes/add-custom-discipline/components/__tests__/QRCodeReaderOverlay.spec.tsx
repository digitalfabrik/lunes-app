import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Pressable, View } from 'react-native'
import { Code } from 'react-native-vision-camera'

import render from '../../../../testing/render'
import QRCodeReaderOverlay from '../QRCodeReaderOverlay'

const apiCode = 'scanned-api-code'

jest.mock('../../../../hooks/useAppState', () => ({
  __esModule: true,
  default: () => () => jest.fn(),
}))
jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

const codes: Code[] = [{ type: 'qr', value: 'scanned-api-code' }]
type OnCodeScanned = (codes: Code[]) => Code[]

jest.mock('react-native-vision-camera', () => ({
  Camera: ({ codeScanner }: { codeScanner: { onCodeScanned: OnCodeScanned } }) => (
    <View accessibilityLabel='scanner'>
      <Pressable accessibilityLabel='mockOnBarCodeRead' onPress={() => codeScanner.onCodeScanned(codes)} />
    </View>
  ),
  useCameraDevice: () => ({ id: 'device1' }),
  useCodeScanner: ({ onCodeScanned }: { onCodeScanned: OnCodeScanned }) => ({ onCodeScanned }),
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
