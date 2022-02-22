import { RenderAPI } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import render from '../../testing/render'
import Loading from '../Loading'

describe('Loading', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const childText = 'Children'

  const renderLoading = (isLoading: boolean): RenderAPI =>
    render(
      <Loading isLoading={isLoading}>
        <Text>{childText}</Text>
      </Loading>
    )

  it('should not render children when isLoading is true', () => {
    const { queryByText, getByTestId } = renderLoading(true)
    expect(queryByText(childText)).toBeFalsy()
    expect(getByTestId('loading')).toBeTruthy()
  })

  it('should render children when isLoading is false', () => {
    const { getByText, queryByTestId } = renderLoading(false)
    expect(getByText(childText)).toBeTruthy()
    expect(queryByTestId('loading')).toBeFalsy()
  })
})
