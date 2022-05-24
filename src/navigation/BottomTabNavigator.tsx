import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components/native'

import {
  BookIconGrey,
  BookIconWhite,
  HeartIconGrey,
  HeartIconWhite,
  HomeIconGrey,
  HomeIconWhite,
  StartIconGrey,
  StartIconWhite
} from '../../assets/images'
import labels from '../constants/labels.json'
import HomeStackNavigator from './HomeStackNavigator'
import { RoutesParams } from './NavigationTypes'

const BottomTabNavigator = createBottomTabNavigator<RoutesParams>()

// TODO LUN-132, LUN-207, LUN-308: Remove this and use actual components
const MockComponent = () => <></>

const Navigator = (): JSX.Element | null => {
  const theme = useTheme()

  return (
    <BottomTabNavigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.background,
        tabBarStyle: { backgroundColor: theme.colors.primary, height: wp('14%') },
        tabBarItemStyle: { height: wp('14%'), padding: wp('2%') },
        tabBarLabelStyle: { fontSize: wp('3%') }
      }}>
      <BottomTabNavigator.Screen
        name='HomeTab'
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeIconWhite width={wp('10%')} height={wp('10%')} />
            ) : (
              <HomeIconGrey width={wp('10%')} height={wp('10%')} />
            ),
          title: labels.general.home
        }}
      />
      <BottomTabNavigator.Screen
        name='FavoritesTab'
        component={MockComponent}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <StartIconWhite width={wp('7%')} height={wp('7%')} />
            ) : (
              <StartIconGrey width={wp('7%')} height={wp('7%')} />
            ),
          title: labels.general.favorites
        }}
      />
      <BottomTabNavigator.Screen
        name='DictionaryTab'
        component={MockComponent}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <BookIconWhite width={wp('7%')} height={wp('7%')} />
            ) : (
              <BookIconGrey width={wp('7%')} height={wp('7%')} />
            ),
          title: labels.general.dictionary
        }}
      />
      <BottomTabNavigator.Screen
        name='UserVocabularyTab'
        component={MockComponent}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HeartIconWhite width={wp('6%')} height={wp('6%')} />
            ) : (
              <HeartIconGrey width={wp('6%')} height={wp('6%')} />
            ),
          title: labels.general.userVocabulary
        }}
      />
    </BottomTabNavigator.Navigator>
  )
}

export default Navigator
