import React from 'react'

import render from '../../../../testing/render'
import HomeFooter from '../HomeFooter'

describe('HomeFooter', () => {
  jest.useFakeTimers().setSystemTime(new Date('2023-05-05'))

  it('should render the HomeFooter', () => {
    const { getByText } = render(<HomeFooter />)

    expect(getByText('\u00A9LUNES2023')).toBeTruthy()
  })
})
