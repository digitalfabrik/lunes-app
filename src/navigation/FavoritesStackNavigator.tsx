import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import VocabularyDetailScreen from '../routes/VocabularyDetailScreen'
import FavoritesScreen from '../routes/favorites/FavoritesScreen'
import { getLabels } from '../services/helpers'
import { RoutesParams } from './NavigationTypes'
import screenOptions, { useTabletHeaderHeight } from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const FavoritesStackNavigator = (): ReactElement => {
  const options = screenOptions(useTabletHeaderHeight())
  const { back } = getLabels().general

  return (
    <Stack.Navigator>
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
