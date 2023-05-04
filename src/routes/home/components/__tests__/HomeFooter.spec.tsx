import React from 'react'

import render from '../../../../testing/render'
import HomeFooter from '../HomeFooter'

describe('HomeFooter', () => {
  it('should render the HomeFooter', () => {
    const { getByText } = render(<HomeFooter />)

    expect(getByText('\u00A9LUNES2022')).toBeTruthy()
  })
})
