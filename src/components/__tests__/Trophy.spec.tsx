import { render } from '@testing-library/react-native'
import React from 'react'

import Trophy from '../Trophy'

describe('Trophy', () => {
  it('should show no trophy when level is 0', () => {
    const { queryByTestId } = render(<Trophy level={0} />)
    expect(queryByTestId('trophy-0')).toBeNull()
  })

  it('should show one trophy when level is 1', () => {
    const { queryByTestId } = render(<Trophy level={0} />)
    expect(queryByTestId('trophy-0')).toBeDefined()
    expect(queryByTestId('trophy-1')).toBeNull()
  })

  it('should show three trophy when level is 3', () => {
    const { queryByTestId } = render(<Trophy level={0} />)
    expect(queryByTestId('trophy-0')).toBeDefined()
    expect(queryByTestId('trophy-1')).toBeDefined()
    expect(queryByTestId('trophy-2')).toBeDefined()
    expect(queryByTestId('trophy-3')).toBeNull()
  })
})
