import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import labels from '../../../../constants/labels.json'
import render from '../../../../testing/render'
import HomeFooter from '../HomeFooter'

describe('HomeFooter', () => {
  it('should render the HomeFooter', () => {
    const navigateToImpressum = jest.fn()

    const { getByText } = render(<HomeFooter navigateToImprint={navigateToImpressum} />)

    expect(getByText('\u00A9LUNES2022')).toBeTruthy()
    expect(getByText(labels.home.impressum)).toBeTruthy()

    fireEvent.press(getByText(labels.home.impressum))

    expect(navigateToImpressum).toHaveBeenCalled()
  })
})
