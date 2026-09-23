import { RouteProp } from '@react-navigation/native'
import { fireEvent, waitFor } from '@testing-library/react-native'
import { mocked } from 'jest-mock'
import React from 'react'

import { InvalidContentAreaCodeError } from '../../constants/endpoints'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { redeemContentAreaCode } from '../../services/ContentAreaService'
import { StorageCache } from '../../services/Storage'
import { getLabels } from '../../services/helpers'
import createNavigationMock from '../../testing/createNavigationPropMock'
import { renderWithStorageCache } from '../../testing/render'
import ActivationScreen from '../ActivationScreen'

jest.mock('../../services/ContentAreaService')
jest.mock('../../services/sentry')

describe('ActivationScreen', () => {
  const navigation = createNavigationMock<'Activation'>()
  let storageCache: StorageCache

  beforeEach(() => {
    storageCache = StorageCache.createDummy()
    mocked(redeemContentAreaCode).mockResolvedValue({ id: 1, token: 'telc_token', name: 'telc gGmbH' })
  })

  const renderScreen = (code = 'ABC123') => {
    const route: RouteProp<RoutesParams, 'Activation'> = {
      key: 'key-1',
      name: 'Activation',
      params: { code },
    }
    return renderWithStorageCache(storageCache, <ActivationScreen route={route} navigation={navigation} />)
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

  it('should redeem the code when add is pressed', async () => {
    const { getByTestId } = renderScreen('MY-CODE')

    fireEvent.press(getByTestId('activation-add-button'))

    await waitFor(() => expect(redeemContentAreaCode).toHaveBeenCalledWith(storageCache, 'MY-CODE'))
  })

  it('should tell the user that an unknown code does not exist', async () => {
    mocked(redeemContentAreaCode).mockRejectedValue(new Error(InvalidContentAreaCodeError))
    const { getByTestId } = renderScreen()

    fireEvent.press(getByTestId('activation-add-button'))

    await waitFor(() =>
      expect(getByTestId('activation-error')).toHaveTextContent(getLabels().activation.error.wrongCode),
    )
    expect(navigation.navigate).not.toHaveBeenCalled()
  })

  it('should report a technical problem if the code could not be sent', async () => {
    mocked(redeemContentAreaCode).mockRejectedValue(new Error('Network Error'))
    const { getByTestId } = renderScreen()

    fireEvent.press(getByTestId('activation-add-button'))

    await waitFor(() =>
      expect(getByTestId('activation-error')).toHaveTextContent(getLabels().activation.error.technical),
    )
  })
})
