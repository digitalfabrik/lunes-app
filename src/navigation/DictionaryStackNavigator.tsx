import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import DictionaryDetailScreen from '../routes/DictionaryDetailScreen'
import DictionaryScreen from '../routes/dictionary/DictionaryScreen'
import { getLabels } from '../services/helpers'
import { RoutesParams } from './NavigationTypes'
import screenOptions, { useTabletHeaderHeight } from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const DictionaryStackNavigator = (): ReactElement => {
  const options = screenOptions(useTabletHeaderHeight())
  const { back } = getLabels().general

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Dictionary'
        component={DictionaryScreen}
        options={({ navigation }) => options(back, navigation)}
      />
      <Stack.Screen
        name='DictionaryDetail'
        component={DictionaryDetailScreen}
        options={({ navigation }) => options(back, navigation)}
      />
    </Stack.Navigator>
  )
}

export default DictionaryStackNavigator
