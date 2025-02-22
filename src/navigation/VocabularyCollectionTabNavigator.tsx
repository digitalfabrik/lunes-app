import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'

import { getLabels } from '../services/helpers'
import FavoritesStackNavigator from './FavoritesStackNavigator'
import { RoutesParams } from './NavigationTypes'
import UserVocabularyStackNavigator from './UserVocabularyStackNavigator'

const Tab = createMaterialTopTabNavigator<RoutesParams>()

const VocabularyCollectionTabNavigator = (): JSX.Element | null => (
  <Tab.Navigator initialRouteName='FavoritesTab'>
    <Tab.Screen name='FavoritesTab' component={FavoritesStackNavigator} options={{ tabBarLabel: 'Favorites' }} />
    <Tab.Screen
      name='UserVocabularyTab'
      component={UserVocabularyStackNavigator}
      options={{ tabBarLabel: getLabels().userVocabulary.myWords }}
    />
  </Tab.Navigator>
)

export default VocabularyCollectionTabNavigator
