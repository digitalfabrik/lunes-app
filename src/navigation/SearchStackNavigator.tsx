import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import VocabularyDetailScreen from '../routes/VocabularyDetailScreen'
import SearchScreen from '../routes/dictionary/SearchScreen'
import { getLabels } from '../services/helpers'
import { RoutesParams } from './NavigationTypes'
import screenOptions, { useTabletHeaderHeight } from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const SearchStackNavigator = (): ReactElement => {
  const options = screenOptions(useTabletHeaderHeight())
  const { back } = getLabels().general

  return (
    <Stack.Navigator>
      <Stack.Screen name='Search' component={SearchScreen} options={({ navigation }) => options(back, navigation)} />
      <Stack.Screen
        name='VocabularyDetail'
        component={VocabularyDetailScreen}
        options={({ navigation }) => options(back, navigation)}
      />
    </Stack.Navigator>
  )
}

export default SearchStackNavigator
