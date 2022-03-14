import React from 'react'

import renderWithTheme from '../../testing/render'
import Trophy from '../Trophy'

describe('Trophy', () => {
  it('should show no trophy when level is 0', () => {
    const { queryByTestId } = renderWithTheme(<Trophy level={0} />)
    expect(queryByTestId('trophy-0')).toBeNull()
  })

  it('should show one trophy when level is 1', () => {
    const { queryByTestId } = renderWithTheme(<Trophy level={1} />)
    expect(queryByTestId('trophy-0')).not.toBeNull()
    expect(queryByTestId('trophy-1')).toBeNull()
  })

  it('should show three trophies when level is 3', () => {
    const { queryByTestId } = renderWithTheme(<Trophy level={3} />)
    expect(queryByTestId('trophy-0')).not.toBeNull()
    expect(queryByTestId('trophy-1')).not.toBeNull()
    expect(queryByTestId('trophy-2')).not.toBeNull()
    expect(queryByTestId('trophy-3')).toBeNull()
  })
})
