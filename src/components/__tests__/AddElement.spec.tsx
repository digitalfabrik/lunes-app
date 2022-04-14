import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import render from '../../testing/render'
import AddElement from '../AddElement'

describe('AddElement', () => {
  const onPress = jest.fn()

  it('should display correctly', () => {
    const { getByText, getByTestId } = render(<AddElement onPress={onPress} label='label' explanation='explanation' />)
    expect(getByTestId('add-icon')).toBeDefined()
    expect(getByText('explanation')).toBeDefined()
    expect(getByText('explanation')).toBeDefined()
  })

  it('should handle click', () => {
    const { getByTestId } = render(<AddElement onPress={onPress} label='label' explanation='explanation' />)
    const icon = getByTestId('add-icon')
    fireEvent.press(icon)
    expect(onPress).toHaveBeenCalledTimes(1)
  })
})
