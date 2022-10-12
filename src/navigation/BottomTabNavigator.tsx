import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { isTablet } from 'react-native-device-info'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import {
  HeartIconGrey,
  HeartIconWhite,
  BookIconGrey,
  BookIconWhite,
  HomeIconGrey,
  HomeIconWhite,
  StarIconGrey,
  StarIconWhite,
} from '../../assets/images'
import FavoritesScreen from '../routes/favorites/FavoritesScreen'
import { getLabels } from '../services/helpers'
import DictionaryStackNavigator from './DictionaryStackNavigator'
import HomeStackNavigator from './HomeStackNavigator'
import { RoutesParams } from './NavigationTypes'
import UserVocabularyStackNavigator from './UserVocabularyStackNavigator'

const Navigator = createBottomTabNavigator<RoutesParams>()

const BottomTabNavigator = (): JSX.Element | null => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const iconSize = hp('3.5%')

  const renderHomeTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? <HomeIconWhite width={hp('5%')} height={hp('5%')} /> : <HomeIconGrey width={hp('5%')} height={hp('5%')} />

  const renderFavoritesTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? <StarIconWhite width={iconSize} height={iconSize} /> : <StarIconGrey width={iconSize} height={iconSize} />

  const renderDictionaryTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? <BookIconWhite width={iconSize} height={iconSize} /> : <BookIconGrey width={iconSize} height={iconSize} />

  const renderUserVocabularyTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <HeartIconWhite width={hp('3.5%')} height={hp('3.5%')} />
    ) : (
      <HeartIconGrey width={hp('3.5%')} height={hp('3.5%')} />
    )

  return (
    <Navigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.background,
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          minHeight: hp('7%'),
          paddingBottom: insets.bottom,
        },
        tabBarItemStyle: { height: hp('7%'), padding: theme.spacingsPlain.xs },
        tabBarLabelStyle: { fontSize: hp('1.5%'), paddingLeft: isTablet() ? hp('1%') : 0 },
      }}>
      <Navigator.Screen
        name='HomeTab'
        component={HomeStackNavigator}
        options={{ tabBarIcon: renderHomeTabIcon, title: getLabels().general.home }}
      />
      <Navigator.Screen
        name='FavoritesTab'
        component={FavoritesScreen}
        options={{ tabBarIcon: renderFavoritesTabIcon, title: getLabels().general.favorites }}
      />
      <Navigator.Screen
        name='DictionaryTab'
        component={DictionaryStackNavigator}
        options={{ tabBarIcon: renderDictionaryTabIcon, title: getLabels().general.dictionary }}
      />
      <Navigator.Screen
        name='UserVocabularyTab'
        component={UserVocabularyStackNavigator}
        options={{ tabBarIcon: renderUserVocabularyTabIcon, title: getLabels().userVocabulary.myWords }}
      />
    </Navigator.Navigator>
  )
}

export default BottomTabNavigator
