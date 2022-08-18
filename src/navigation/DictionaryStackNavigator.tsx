import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import labels from '../constants/labels.json'
import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import DictionaryDetailScreen from '../routes/DictionaryDetailScreen'
import DictionaryScreen from '../routes/DictionaryScreen'
import { RoutesParams } from './NavigationTypes'
import screenOptions, { headerHeightPercentage } from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const DictionaryStackNavigator = (): ReactElement => {
  const headerHeight = useTabletHeaderHeight(headerHeightPercentage)
  const options = screenOptions(headerHeight)
  const { back } = labels.general

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
