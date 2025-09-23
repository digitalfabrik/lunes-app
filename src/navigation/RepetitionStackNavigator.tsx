import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement } from 'react'

import VocabularyDetailScreen from '../routes/VocabularyDetailScreen'
import RepetitionScreen from '../routes/repetition/RepetitionScreen'
import RepetitionWordListScreen from '../routes/repetition/RepetitionWordListScreen'
import { getLabels } from '../services/helpers'
import { RoutesParams } from './NavigationTypes'
import screenOptions, { useTabletHeaderHeight } from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const RepetitionStackNavigator = (): ReactElement | null => {
  const options = screenOptions(useTabletHeaderHeight())
  const { back } = getLabels().general

  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Repetition'
        component={RepetitionScreen}
        options={({ navigation }) => options(back, navigation)}
      />
      <Stack.Screen
        name='RepetitionWordList'
        component={RepetitionWordListScreen}
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

export default RepetitionStackNavigator
