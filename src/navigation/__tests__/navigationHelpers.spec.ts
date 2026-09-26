import createNavigationMock from '../../testing/createNavigationPropMock'
import { resetToHome } from '../navigationHelpers'

describe('resetToHome', () => {
  it('should reset the navigation stack to the home screen', () => {
    const navigation = createNavigationMock<'Activation'>()

    resetToHome(navigation)

    expect(navigation.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'BottomTabNavigator', params: { screen: 'HomeTab', params: { screen: 'Home' } } }],
    })
  })
})
