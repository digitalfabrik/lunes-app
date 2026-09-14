import { RouteProp } from '@react-navigation/native'
import { fireEvent } from '@testing-library/react-native'
import React from 'react'

import { RoutesParams } from '../../navigation/NavigationTypes'
import createNavigationMock from '../../testing/createNavigationPropMock'
import renderWithTheme from '../../testing/render'
import ActivationScreen from '../ActivationScreen'

describe('ActivationScreen', () => {
  const navigation = createNavigationMock<'Activation'>()

  const renderScreen = (code = 'ABC123') => {
    const route: RouteProp<RoutesParams, 'Activation'> = {
      key: 'key-1',
      name: 'Activation',
      params: { code },
    }
    return renderWithTheme(<ActivationScreen route={route} navigation={navigation} />)
  }

  it('should display the code received via the deeplink', () => {
    const { getByTestId } = renderScreen('MY-CODE')

    expect(getByTestId('activation-code')).toHaveTextContent('MY-CODE')
  })

  it('should navigate to the start page, skipping the initial job selection, when cancel is pressed', () => {
    const { getByTestId } = renderScreen()

    fireEvent.press(getByTestId('activation-cancel-button'))

    expect(navigation.navigate).toHaveBeenCalledWith('BottomTabNavigator', {
      screen: 'HomeTab',
      params: { screen: 'Home' },
    })
  })

  it('should show a primary add button that does not navigate anywhere yet', () => {
    const { getByTestId } = renderScreen()

    fireEvent.press(getByTestId('activation-add-button'))

    expect(navigation.navigate).not.toHaveBeenCalled()
  })
})
