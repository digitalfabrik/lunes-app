import { NavigationProp } from '@react-navigation/native'

import { RoutesParams } from './NavigationTypes'

// A plain navigate() can leave a transparentModal screen (e.g. the side menu) stranded beneath
// the current one, since it only pops back to an existing route instead of clearing the stack
export const resetToHome = (navigation: NavigationProp<RoutesParams>): void => {
  navigation.reset({
    index: 0,
    routes: [{ name: 'BottomTabNavigator', params: { screen: 'HomeTab', params: { screen: 'Home' } } }],
  })
}
