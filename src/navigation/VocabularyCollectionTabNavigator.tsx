import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import React, { ReactElement } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import theme from '../constants/theme'
import useIsReducedMotionEnabled from '../hooks/useIsReducedMotionEnabled'
import { getLabels } from '../services/helpers'
import FavoritesStackNavigator from './FavoritesStackNavigator'
import { RoutesParams } from './NavigationTypes'
import UserVocabularyStackNavigator from './UserVocabularyStackNavigator'

const Tab = createMaterialTopTabNavigator<RoutesParams>()

const VocabularyCollectionTabNavigator = (): ReactElement | null => {
  const insets = useSafeAreaInsets()
  const isReducedMotionEnabled = useIsReducedMotionEnabled()

  return (
    <Tab.Navigator
      initialRouteName='UserVocabularyTab'
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: theme.colors.primary, height: 4 },
        tabBarStyle: { paddingTop: insets.top },
        animationEnabled: !isReducedMotionEnabled,
      }}
    >
      <Tab.Screen
        name='UserVocabularyTab'
        component={UserVocabularyStackNavigator}
        options={{ tabBarLabel: getLabels().general.userVocabulary }}
      />
      <Tab.Screen
        name='FavoritesTab'
        component={FavoritesStackNavigator}
        options={{ tabBarLabel: getLabels().favorites.title }}
      />
    </Tab.Navigator>
  )
}

export default VocabularyCollectionTabNavigator
