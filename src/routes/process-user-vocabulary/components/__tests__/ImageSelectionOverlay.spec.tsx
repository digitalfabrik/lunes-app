import React, { ReactElement } from 'react'
import { View } from 'react-native'

import render from '../../../../testing/render'
import ImageSelectionOverlay from '../ImageSelectionOverlay'

jest.mock('../../../../components/CameraOverlay', () => ({ children }: { children: ReactElement }) => (
  <View>{children}</View>
))

jest.mock('../../../../hooks/useAppState', () => ({
  __esModule: true,
  default: () => () => jest.fn(),
}))

jest.mock('react-native-vision-camera', () => ({
  Camera: jest.fn(),
  useCameraDevice: jest.fn(() => ({ id: 'device1' })),
}))

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(),
}))

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

describe('ImageSelectionOverlay', () => {
  it('should render shutter and gallery icon', () => {
    const { getByTestId } = render(<ImageSelectionOverlay setVisible={jest.fn()} pushImage={jest.fn()} />)
    expect(getByTestId('take-image-icon')).toBeDefined()
    expect(getByTestId('gallery-icon')).toBeDefined()
  })
})
