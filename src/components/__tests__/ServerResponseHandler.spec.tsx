import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import { getLabels } from '../../services/helpers'
import render from '../../testing/render'
import ServerResponseHandler from '../ServerResponseHandler'

describe('ServerResponseHandler', () => {
  const refresh = jest.fn()

  it('should render error', () => {
    const error = new Error('My test error')
    const { getByText } = render(
      <ServerResponseHandler error={error} loading={false} refresh={refresh}>
        TestContent
      </ServerResponseHandler>
    )

    expect(getByText(error.message)).toBeTruthy()
    fireEvent.press(getByText(getLabels().general.error.retryButton))
    expect(refresh).toHaveBeenCalledTimes(1)
  })

  it('should render loading spinner', () => {
    const { getByTestId } = render(
      <ServerResponseHandler error={null} loading refresh={refresh}>
        TestContent
      </ServerResponseHandler>
    )

    expect(getByTestId('loading')).toBeTruthy()
  })

  it('should render children', () => {
    const { getByText } = render(
      <ServerResponseHandler error={null} loading={false} refresh={refresh}>
        <Text>TestContent</Text>
      </ServerResponseHandler>
    )

    expect(getByText('TestContent')).toBeTruthy()
  })
})
