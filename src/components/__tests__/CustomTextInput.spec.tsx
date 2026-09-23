import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { COLORS } from '../../constants/theme/colors'
import render from '../../testing/render'
import CustomTextInput from '../CustomTextInput'

describe('CustomTextInput', () => {
  const onChangeText = jest.fn()

  it('should show placeholder text', () => {
    const { getByPlaceholderText } = render(
      <CustomTextInput value='' clearable placeholder='Test' onChangeText={onChangeText} />,
    )
    expect(getByPlaceholderText('Test')).toBeTruthy()
  })

  it('should not show clear indicator with empty input', () => {
    const { queryByTestId } = render(
      <CustomTextInput value='' clearable placeholder='Test' onChangeText={onChangeText} />,
    )
    expect(queryByTestId('clearInput')).toBeNull()
  })

  it('should show indicator when input was set', () => {
    const { getByTestId } = render(
      <CustomTextInput value='My Input' clearable placeholder='Test' onChangeText={onChangeText} />,
    )
    expect(getByTestId('clearInput')).toBeTruthy()
  })

  describe('characterLimit', () => {
    it('should not show a counter without a limit', () => {
      const { queryByText } = render(<CustomTextInput value='abc' placeholder='Test' onChangeText={onChangeText} />)
      expect(queryByText('3 / 10')).toBeNull()
    })

    it('should count code points so that an emoji counts as one character', () => {
      const { getByText } = render(
        <CustomTextInput value='🚧🧱🔧' characterLimit={10} placeholder='Test' onChangeText={onChangeText} />,
      )
      expect(getByText('3 / 10')).toBeTruthy()
    })

    it('should truncate input to the limit', () => {
      const { getByPlaceholderText } = render(
        <CustomTextInput value='' characterLimit={5} placeholder='Test' onChangeText={onChangeText} />,
      )

      fireEvent.changeText(getByPlaceholderText('Test'), 'abcdefgh')

      expect(onChangeText).toHaveBeenCalledWith('abcde')
    })

    it('should truncate a pasted insertion instead of rejecting it', () => {
      const { getByPlaceholderText } = render(
        <CustomTextInput value='abcd' characterLimit={5} placeholder='Test' onChangeText={onChangeText} />,
      )

      fireEvent.changeText(getByPlaceholderText('Test'), 'aXYbcd')

      expect(onChangeText).toHaveBeenCalledWith('aXYbc')
    })

    it('should mark the counter as at the limit', () => {
      const { getByText } = render(
        <CustomTextInput value={'a'.repeat(5)} characterLimit={5} placeholder='Test' onChangeText={onChangeText} />,
      )

      expect(getByText('5 / 5')).toHaveStyle({ color: COLORS.incorrect })
    })

    it('should not mark the counter below the limit', () => {
      const { getByText } = render(
        <CustomTextInput value='abcd' characterLimit={5} placeholder='Test' onChangeText={onChangeText} />,
      )

      expect(getByText('4 / 5')).not.toHaveStyle({ color: COLORS.incorrect })
    })

    it('should still truncate text appended to what is already there', () => {
      const { getByPlaceholderText } = render(
        <CustomTextInput value='ab' characterLimit={5} placeholder='Test' onChangeText={onChangeText} />,
      )

      fireEvent.changeText(getByPlaceholderText('Test'), 'abcdefgh')

      expect(onChangeText).toHaveBeenCalledWith('abcde')
    })

    it('should show the error message without hiding the hint', () => {
      const { getByText, rerender } = render(
        <CustomTextInput value='abc' hint='Any language' placeholder='Test' onChangeText={onChangeText} />,
      )
      expect(getByText('Any language')).toBeTruthy()

      rerender(
        <CustomTextInput
          value=''
          hint='Any language'
          errorMessage='Cannot be empty'
          placeholder='Test'
          onChangeText={onChangeText}
        />,
      )

      expect(getByText('Cannot be empty')).toBeTruthy()
      expect(getByText('Any language')).toBeTruthy()
    })

    it('should not truncate input that is within the limit', () => {
      const { getByPlaceholderText } = render(
        <CustomTextInput value='' characterLimit={5} placeholder='Test' onChangeText={onChangeText} />,
      )

      fireEvent.changeText(getByPlaceholderText('Test'), 'abc')

      expect(onChangeText).toHaveBeenCalledWith('abc')
    })
  })
})
