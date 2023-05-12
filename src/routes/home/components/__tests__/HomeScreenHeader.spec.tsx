import { NavigationContainer } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import createNavigationMock from '../../../../testing/createNavigationPropMock'
import render from '../../../../testing/render'
import HomeScreenHeader from '../HomeScreenHeader'

describe('HomeScreenHeader', () => {
  const navigation = createNavigationMock<'Home'>()

  it('should open the header overlay', () => {
    const { getByTestId } = render(
      <NavigationContainer>
        <HomeScreenHeader navigation={navigation} />
      </NavigationContainer>
    )

    const menu = getByTestId('menu-icon-white')
    expect(menu).toBeTruthy()

    fireEvent.press(menu)

    expect(navigation.navigate).toHaveBeenCalledWith('OverlayMenu')
  })
})
