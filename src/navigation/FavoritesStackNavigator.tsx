import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import useIsReducedMotionEnabled from '../hooks/useIsReducedMotionEnabled'
import VocabularyDetailScreen from '../routes/VocabularyDetailScreen'
import FavoritesScreen from '../routes/favorites/FavoritesScreen'
import { getLabels } from '../services/helpers'
import { RoutesParams } from './NavigationTypes'
import screenOptions, { reducedMotionScreenOptions, useTabletHeaderHeight } from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const FavoritesStackNavigator = (): ReactElement => {
  const options = screenOptions(useTabletHeaderHeight())
  const isReducedMotionEnabled = useIsReducedMotionEnabled()
  const { back } = getLabels().general

  return (
    <Stack.Navigator
      screenOptions={{ headerStatusBarHeight: 0, ...reducedMotionScreenOptions(isReducedMotionEnabled) }}
    >
      <Stack.Screen name='Favorites' component={FavoritesScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name='VocabularyDetail'
        component={VocabularyDetailScreen}
        options={({ navigation }) => options(back, navigation)}
      />
    </Stack.Navigator>
  )
}

export default FavoritesStackNavigator
