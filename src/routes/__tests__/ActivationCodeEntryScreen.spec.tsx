import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import renderWithTheme from '../../testing/render'
import ActivationCodeEntryScreen from '../ActivationCodeEntryScreen'

describe('ActivationCodeEntryScreen', () => {
  const navigation = createNavigationMock<'ActivationCodeEntry'>()

  it('should display the description', () => {
    const { getByText } = renderWithTheme(<ActivationCodeEntryScreen navigation={navigation} />)

    expect(getByText(getLabels().activationCodeEntry.description)).toBeTruthy()
  })

  it('should replace itself with the activation screen with the entered code when submitted', () => {
    const { getByPlaceholderText } = renderWithTheme(<ActivationCodeEntryScreen navigation={navigation} />)

    const input = getByPlaceholderText(getLabels().activationCodeEntry.placeholder)
    fireEvent.changeText(input, '12345')
    fireEvent(input, 'submitEditing')

    expect(navigation.replace).toHaveBeenCalledWith('Activation', { code: '12345' })
  })

  it('should not navigate when the code is empty', () => {
    const { getByPlaceholderText } = renderWithTheme(<ActivationCodeEntryScreen navigation={navigation} />)

    const input = getByPlaceholderText(getLabels().activationCodeEntry.placeholder)
    fireEvent(input, 'submitEditing')

    expect(navigation.replace).not.toHaveBeenCalled()
  })

  it('should accept letters and digits without auto-correction, since codes are alphanumeric', () => {
    const { getByPlaceholderText } = renderWithTheme(<ActivationCodeEntryScreen navigation={navigation} />)

    const input = getByPlaceholderText(getLabels().activationCodeEntry.placeholder)
    expect(input.props.autoCorrect).toBe(false)
    expect(input.props.keyboardType).not.toBe('number-pad')
  })
})
