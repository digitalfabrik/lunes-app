import { NavigationContainer } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import ContentArea from '../../../../models/ContentArea'
import createNavigationMock from '../../../../testing/createNavigationPropMock'
import { mockTelcArea } from '../../../../testing/mockContentArea'
import render from '../../../../testing/render'
import HomeScreenHeader from '../HomeScreenHeader'

describe('HomeScreenHeader', () => {
  const navigation = createNavigationMock<'Home'>()

  it('should open the header overlay', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreenHeader navigation={navigation} />
      </NavigationContainer>,
    )

    const menu = getByTestId('menu-icon-white')
    expect(menu).toBeTruthy()

    fireEvent.press(menu)

    expect(navigation.navigate).toHaveBeenCalledWith('OverlayMenu')
  })

  describe('with a content area', () => {
    const telc = mockTelcArea()

    const renderHeader = (contentArea?: ContentArea) =>
      render(
        <NavigationContainer>
          <HomeScreenHeader navigation={navigation} contentArea={contentArea} />
        </NavigationContainer>,
      )

    it('should show the main logo of the area in the middle and the secondary logo next to it', () => {
      const { getByTestId } = renderHeader(telc)

      expect(getByTestId('main-logo').props.source).toEqual({ uri: 'https://lunes.example/logo.png' })
      expect(getByTestId('secondary-logo').props.source).toEqual({ uri: 'https://lunes.example/secondary.png' })
    })

    it('should keep the Lunes logo if the area has no main logo', () => {
      const { queryByTestId, getByTestId } = renderHeader({ ...telc, logoUrl: undefined })

      expect(queryByTestId('main-logo')).toBeNull()
      expect(getByTestId('lunes-logo')).toBeTruthy()
      expect(getByTestId('secondary-logo')).toBeTruthy()
    })

    it('should show the Lunes logo if the main logo cannot be loaded', () => {
      const { queryByTestId, getByTestId } = renderHeader(telc)
      expect(queryByTestId('lunes-logo')).toBeNull()

      fireEvent(getByTestId('main-logo'), 'error')

      expect(queryByTestId('main-logo')).toBeNull()
      expect(getByTestId('lunes-logo')).toBeTruthy()
    })

    it('should announce the area once to screen readers', () => {
      const { getByLabelText, getByTestId } = renderHeader(telc)

      expect(getByLabelText('telc')).toBe(getByTestId('main-logo'))
      expect(getByTestId('secondary-logo')).toHaveProp('accessible', false)
    })
  })
})
