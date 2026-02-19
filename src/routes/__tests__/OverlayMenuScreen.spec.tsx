import { NavigationContainer } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import renderWithTheme from '../../testing/render'
import OverlayMenu from '../OverlayMenuScreen'

describe('OverlayMenu', () => {
  const navigation = createNavigationMock<'OverlayMenu'>()

  it('should correctly close overlay', () => {
    const { getByTestId } = renderWithTheme(
      <NavigationContainer>
        <OverlayMenu navigation={navigation} />
      </NavigationContainer>,
    )
    const close = getByTestId('close-icon-white')
    expect(close).toBeTruthy()
    fireEvent.press(close)
    expect(navigation.goBack).toHaveBeenCalled()
  })

  it.each([
    { menuItem: getLabels().general.header.settings, route: 'Settings' },
    { menuItem: getLabels().general.header.sponsors, route: 'Sponsors' },
    { menuItem: getLabels().general.header.impressum, route: 'Imprint' },
  ])('should navigate to $route', ({ menuItem, route }) => {
    const { getByText } = renderWithTheme(
      <NavigationContainer>
        <OverlayMenu navigation={navigation} />
      </NavigationContainer>,
    )

    const item = getByText(menuItem)
    expect(item).toBeTruthy()
    fireEvent.press(item)
    expect(navigation.popTo).toHaveBeenCalledWith('BottomTabNavigator', {
      screen: 'HomeTab',
      params: { screen: route },
    })
  })
})
