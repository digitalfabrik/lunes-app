import React, { ReactElement, ReactNode } from 'react'
import { View } from 'react-native'

import render from '../../../../testing/render'
import ImageSelectionOverlay from '../ImageSelectionOverlay'

jest.mock('../../../../components/CameraOverlay', () => ({ children }: { children: ReactElement }) => (
  <View>{children}</View>
))

jest.mock('react-native-camera', () => ({
  RNCamera: ({ children }: { children: ReactNode }) => <View>{children}</View>,
}))

jest.mock('react-native-permissions', () => require('react-native-permissions/mock'))

describe('ImageSelectionOverlay', () => {
  it('should render shutter and gallery icon', () => {
    const { getByTestId } = render(
      <ImageSelectionOverlay setVisible={jest.fn()} pushImage={jest.fn()} setImageShouldBeCopied={jest.fn()} />
    )
    expect(getByTestId('take-image-icon')).toBeDefined()
    expect(getByTestId('gallery-icon')).toBeDefined()
  })
})
