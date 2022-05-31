import React from 'react'

import render from '../../testing/render'
import CustomTextInput from '../CustomTextInput'

describe('CustomTextInput', () => {
  const onChangeText = jest.fn()

  it('should show placeholder text', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput value='' clearable placeholder='Test' onChangeText={onChangeText} />
    )
    expect(getByPlaceholderText('Test')).toBeTruthy()
  })

  it('should not show clear indicator with empty input', () => {
    const { queryByTestId } = render(
      <CustomTextInput value='' clearable placeholder='Test' onChangeText={onChangeText} />
    )
    expect(queryByTestId('clearInput')).toBeNull()
  })

  it('should show indicator when input was set', () => {
    const { getByTestId } = render(
      <CustomTextInput value='My Input' clearable placeholder='Test' onChangeText={onChangeText} />
    )
    expect(getByTestId('clearInput')).toBeTruthy()
  })
})
