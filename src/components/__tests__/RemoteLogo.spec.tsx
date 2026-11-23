import { fireEvent } from '@testing-library/react-native'
import React from 'react'
import { Text } from 'react-native'

import render from '../../testing/render'
import RemoteLogo from '../RemoteLogo'

describe('RemoteLogo', () => {
  const logo = (uri: string, fallback?: React.ReactElement) => (
    <RemoteLogo testID='logo' uri={uri} width={72} height={30} fallback={fallback} />
  )
  const renderLogo = (uri: string, fallback?: React.ReactElement) => render(logo(uri, fallback))

  it('should render an SVG logo', () => {
    const { getByTestId } = renderLogo('https://lunes.example/logo.svg?v=2')

    expect(getByTestId('logo').props.uri).toBe('https://lunes.example/logo.svg?v=2')
    expect(getByTestId('logo').props.source).toBeUndefined()
  })

  it('should render a raster logo', () => {
    const { getByTestId } = renderLogo('https://lunes.example/logo.png')

    expect(getByTestId('logo').props.source).toEqual({ uri: 'https://lunes.example/logo.png' })
  })

  it.each(['https://lunes.example/logo.svg', 'https://lunes.example/logo.png'])(
    'should show the fallback if %s cannot be loaded',
    uri => {
      const { getByTestId, getByText, queryByTestId } = renderLogo(uri, <Text>Fallback</Text>)

      fireEvent(getByTestId('logo'), 'error')

      expect(queryByTestId('logo')).toBeNull()
      expect(getByText('Fallback')).toBeTruthy()
    },
  )

  it('should try a new logo after the previous one could not be loaded', () => {
    const { getByTestId, rerender } = renderLogo('https://lunes.example/old.svg')
    fireEvent(getByTestId('logo'), 'error')

    rerender(logo('https://lunes.example/new.svg'))

    expect(getByTestId('logo').props.uri).toBe('https://lunes.example/new.svg')
  })

  it('should show nothing if the logo cannot be loaded and there is no fallback', () => {
    const { getByTestId, queryByTestId } = renderLogo('https://lunes.example/logo.svg')

    fireEvent(getByTestId('logo'), 'error')

    expect(queryByTestId('logo')).toBeNull()
  })
})
