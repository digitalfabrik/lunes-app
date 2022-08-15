import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import {
  HeartIconGrey,
  HeartIconWhite,
  HomeIconGrey,
  HomeIconWhite,
  StarIconGrey,
  StarIconWhite,
} from '../../assets/images'
import labels from '../constants/labels.json'
import FavoritesScreen from '../routes/FavoritesScreen'
import HomeStackNavigator from './HomeStackNavigator'
import { RoutesParams } from './NavigationTypes'
import UserVocabularyStackNavigator from './UserVocabularyStackNavigator'

const Navigator = createBottomTabNavigator<RoutesParams>()

const BottomTabNavigator = (): JSX.Element | null => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const iconSize = wp('10%')

  const renderHomeTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? <HomeIconWhite width={iconSize} height={iconSize} /> : <HomeIconGrey width={iconSize} height={iconSize} />

  const renderFavoritesTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? <StarIconWhite width={wp('7%')} height={wp('7%')} /> : <StarIconGrey width={wp('7%')} height={wp('7%')} />

  const renderUserVocabularyTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <HeartIconWhite width={wp('7%')} height={wp('7%')} />
    ) : (
      <HeartIconGrey width={wp('7%')} height={wp('7%')} />
    )

  return (
    <Navigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.background,
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          minHeight: wp('14%'),
          paddingBottom: insets.bottom,
        },
        tabBarItemStyle: { height: wp('14%'), padding: wp('2%') },
        tabBarLabelStyle: { fontSize: wp('3%') },
      }}>
      <Navigator.Screen
        name='HomeTab'
        component={HomeStackNavigator}
        options={{ tabBarIcon: renderHomeTabIcon, title: labels.general.home }}
      />
      <Navigator.Screen
        name='FavoritesTab'
        component={FavoritesScreen}
        options={{ tabBarIcon: renderFavoritesTabIcon, title: labels.general.favorites }}
      />
      <Navigator.Screen
        name='UserVocabularyTab'
        component={UserVocabularyStackNavigator}
        options={{ tabBarIcon: renderUserVocabularyTabIcon, title: labels.ownVocabulary.vocabulary }}
      />
    </Navigator.Navigator>
  )
}

export default BottomTabNavigator
