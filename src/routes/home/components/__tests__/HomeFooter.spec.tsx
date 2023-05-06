import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../../services/helpers'
import render from '../../../../testing/render'
import HomeFooter from '../HomeFooter'

describe('HomeFooter', () => {
  it('should render the HomeFooter', () => {
    const navigateToImpressum = jest.fn()

    const { getByText } = render(<HomeFooter navigateToImprint={navigateToImpressum} />)

    expect(getByText('\u00A9LUNES2023')).toBeTruthy()
    expect(getByText(getLabels().home.impressum)).toBeTruthy()

    fireEvent.press(getByText(getLabels().home.impressum))

    expect(navigateToImpressum).toHaveBeenCalled()
  })
})
