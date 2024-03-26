import React from 'react'
import { Platform } from 'react-native'

import theme from '../../constants/theme'
import render from '../../testing/render'
import RouteWrapper from '../RouteWrapper'

jest.mock('../../services/url', () => ({ openExternalUrl: jest.fn() }))

describe('RouteWrapper', () => {
  it('should have an extra container on ios', () => {
    const platform = Platform.OS
    Platform.OS = 'ios'
    const { queryByTestId } = render(
      <RouteWrapper bottomBackgroundColor={theme.colors.background}>
        <div />
      </RouteWrapper>,
    )
    expect(queryByTestId('hiddenContainer')).toBeDefined()
    Platform.OS = platform
  })

  it('should not have an extra container when not on ios', () => {
    const platform = Platform.OS
    Platform.OS = 'android'
    const { queryByTestId } = render(
      <RouteWrapper bottomBackgroundColor={theme.colors.background}>
        <div />
      </RouteWrapper>,
    )
    expect(queryByTestId('hiddenContainer')).toBeNull()
    Platform.OS = platform
  })
})
