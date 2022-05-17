import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import render from '../../testing/render'
import AddElement from '../AddElement'

describe('AddElement', () => {
  const onPress = jest.fn()

  it('should display correctly', () => {
    const { getByText } = render(<AddElement onPress={onPress} label='label' explanation='explanation' />)
    expect(getByText('label')).toBeDefined()
    expect(getByText('explanation')).toBeDefined()
  })

  it('should handle click', () => {
    const { getByText } = render(<AddElement onPress={onPress} label='label' explanation='explanation' />)
    const icon = getByText('label')
    fireEvent.press(icon)
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
