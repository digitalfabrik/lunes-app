import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import useIsReducedMotionEnabled from '../hooks/useIsReducedMotionEnabled'
import VocabularyDetailScreen from '../routes/VocabularyDetailScreen'
import DictionaryScreen from '../routes/dictionary/DictionaryScreen'
import { getLabels } from '../services/helpers'
import { RoutesParams } from './NavigationTypes'
import screenOptions, { reducedMotionScreenOptions, useTabletHeaderHeight } from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const DictionaryStackNavigator = (): ReactElement => {
  const options = screenOptions(useTabletHeaderHeight())
  const isReducedMotionEnabled = useIsReducedMotionEnabled()
  const { back } = getLabels().general

  return (
    <Stack.Navigator screenOptions={reducedMotionScreenOptions(isReducedMotionEnabled)}>
      <Stack.Screen
        name='Dictionary'
        component={DictionaryScreen}
        options={({ navigation }) => options(back, navigation)}
      />
      <Stack.Screen
        name='VocabularyDetail'
        component={VocabularyDetailScreen}
        options={({ navigation }) => options(back, navigation)}
      />
    </Stack.Navigator>
  )
}

export default DictionaryStackNavigator
