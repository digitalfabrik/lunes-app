import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import Sponsor from '../../../models/Sponsor'
import { openExternalUrl } from '../../../services/url'
import { mockUseLoadAsyncWithData } from '../../../testing/mockUseLoadFromEndpoint'
import renderWithTheme from '../../../testing/render'
import SponsorsScreen from '../SponsorsScreen'

jest.mock('../../../services/url', () => ({
  openExternalUrl: jest.fn(),
}))
describe('SponsorsScreen', () => {
  const sponsors: Sponsor[] = [
    {
      name: 'Zentralverband des Deutschen Bäckerhandwerks e.V.',
      url: 'https://www.baeckerhandwerk.de/',
      logo: 'baeckericon',
    },
    {
      name: 'Die Gebäudedienstleister',
      url: 'https://www.die-gebaeudedienstleister.de',
      logo: null,
    },
  ]

  it('should display all sponsors', () => {
    mockUseLoadAsyncWithData(sponsors)

    const { getByText } = renderWithTheme(<SponsorsScreen />)

    expect(getByText(sponsors[0].name)).toBeTruthy()
    expect(getByText(sponsors[1].name)).toBeTruthy()

    fireEvent.press(getByText(sponsors[0].name))
    expect(openExternalUrl).toHaveBeenCalledWith(sponsors[0].url)
  })
})
