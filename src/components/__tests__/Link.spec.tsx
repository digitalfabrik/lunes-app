import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { openExternalUrl } from '../../services/url'
import render from '../../testing/render'
import Link from '../Link'

jest.mock('../../services/url', () => ({ openExternalUrl: jest.fn() }))

describe('Link', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render Link', () => {
    const linkText = 'LinkText'
    const url = 'https://integreat-app.de'
    const { getByText } = render(<Link text={linkText} url={url} />)
    expect(getByText(linkText)).toBeTruthy()
  })

  it('should fire onPress when pressed', () => {
    const linkText = 'LinkText'
    const url = 'https://integreat-app.de'
    const { getByText } = render(<Link text={linkText} url={url} />)
    const link = getByText(linkText)

    fireEvent.press(link)

    expect(openExternalUrl).toHaveBeenCalledWith(url)
  })
})
