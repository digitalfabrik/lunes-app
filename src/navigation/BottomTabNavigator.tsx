import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
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
import FavoritesScreen from '../routes/FavoritesScreen'
import { getLabels } from '../services/helpers'
import DictionaryStackNavigator from './DictionaryStackNavigator'
import HomeStackNavigator from './HomeStackNavigator'
import { RoutesParams } from './NavigationTypes'
import UserVocabularyStackNavigator from './UserVocabularyStackNavigator'

const Navigator = createBottomTabNavigator<RoutesParams>()

const BottomTabNavigator = (): JSX.Element | null => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const iconSize = wp('7%')

  const renderHomeTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <HomeIconWhite width={wp('10%')} height={wp('10%')} />
    ) : (
      <HomeIconGrey width={wp('10%')} height={wp('10%')} />
    )

  const renderFavoritesTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? <StarIconWhite width={iconSize} height={iconSize} /> : <StarIconGrey width={iconSize} height={iconSize} />

  const renderDictionaryTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? <BookIconWhite width={iconSize} height={iconSize} /> : <BookIconGrey width={iconSize} height={iconSize} />

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
        options={{ tabBarIcon: renderUserVocabularyTabIcon, title: getLabels().ownVocabulary.myWords }}
      />
    </Navigator.Navigator>
  )
}

export default BottomTabNavigator
