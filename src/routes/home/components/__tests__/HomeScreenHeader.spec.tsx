import { NavigationContainer } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { getLabels } from '../../../../services/helpers'
import createNavigationMock from '../../../../testing/createNavigationPropMock'
import render from '../../../../testing/render'
import HomeScreenHeader from '../HomeScreenHeader'

describe('HomeScreenHeader', () => {
  const navigation = createNavigationMock<'Home'>()

  it('should open and close the header overlay', () => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <HomeScreenHeader navigation={navigation} />
      </NavigationContainer>
    )

    const menu = getByTestId('menu-icon-white')
    expect(menu).toBeTruthy()

    fireEvent.press(menu)

    expect(getByText(getLabels().general.header.settings)).toBeTruthy()
    expect(getByText(getLabels().general.header.sponsors)).toBeTruthy()
    expect(getByText(getLabels().general.header.impressum)).toBeTruthy()
    expect(getByText(getLabels().general.header.manageSelection)).toBeTruthy()

    const close = getByTestId('close-icon-white')
    expect(close).toBeTruthy()

    fireEvent.press(close)

    expect(getByTestId('menu-icon-white')).toBeTruthy()
  })

  it.each([
    { menuItem: getLabels().general.header.settings, route: 'Settings' },
    { menuItem: getLabels().general.header.sponsors, route: 'Sponsors' },
    { menuItem: getLabels().general.header.impressum, route: 'Imprint' },
    { menuItem: getLabels().general.header.manageSelection, route: 'ManageSelection' },
  ])('should navigate to $route', ({ menuItem, route }) => {
    const { getByTestId, getByText } = render(
      <NavigationContainer>
        <HomeScreenHeader navigation={navigation} />
      </NavigationContainer>
    )

    const menu = getByTestId('menu-icon-white')
    expect(menu).toBeTruthy()

    fireEvent.press(menu)
    fireEvent.press(getByText(menuItem))
    expect(navigation.navigate).toHaveBeenCalledWith(route)
  })
})
