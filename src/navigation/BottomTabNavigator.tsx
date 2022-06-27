import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import { HomeIconGrey, HomeIconWhite, StarIconGrey, StarIconWhite } from '../../assets/images'
import labels from '../constants/labels.json'
import FavoritesScreen from '../routes/FavoritesScreen'
import HomeStackNavigator from './HomeStackNavigator'
import { RoutesParams } from './NavigationTypes'

const Navigator = createBottomTabNavigator<RoutesParams>()

const BottomTabNavigator = (): JSX.Element | null => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  return (
    <Navigator.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.background,
        tabBarStyle: {
          backgroundColor: theme.colors.primary,
          minHeight: wp('14%'),
          paddingBottom: insets.bottom
        },
        tabBarItemStyle: { height: wp('14%'), padding: wp('2%') },
        tabBarLabelStyle: { fontSize: wp('3%') }
      }}>
      <Navigator.Screen
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
      <Navigator.Screen
        name='FavoritesTab'
        component={FavoritesScreen}
        options={{
          tabBarIcon: ({ focused }) =>
            focused ? (
              <StarIconWhite width={wp('7%')} height={wp('7%')} />
            ) : (
              <StarIconGrey width={wp('7%')} height={wp('7%')} />
            ),
          title: labels.general.favorites
        }}
      />
      {/* <Navigator.Screen */}
      {/*  name='DictionaryTab' */}
      {/*  component={MockComponent} */}
      {/*  options={{ */}
      {/*    tabBarIcon: ({ focused }) => */}
      {/*      focused ? ( */}
      {/*        <BookIconWhite width={wp('7%')} height={wp('7%')} /> */}
      {/*      ) : ( */}
      {/*        <BookIconGrey width={wp('7%')} height={wp('7%')} /> */}
      {/*      ), */}
      {/*    title: labels.general.dictionary */}
      {/*  }} */}
      {/* /> */}
      {/* TODO LUN-308: Uncomment */}
      {/* <Navigator.Screen */}
      {/*  name='UserVocabularyTab' */}
      {/*  component={MockComponent} */}
      {/*  options={{ */}
      {/*    tabBarIcon: ({ focused }) => */}
      {/*      focused ? ( */}
      {/*        <HeartIconWhite width={wp('6%')} height={wp('6%')} /> */}
      {/*      ) : ( */}
      {/*        <HeartIconGrey width={wp('6%')} height={wp('6%')} /> */}
      {/*      ), */}
      {/*    title: labels.general.userVocabulary */}
      {/*  }} */}
      {/* /> */}
    </Navigator.Navigator>
  )
}

export default BottomTabNavigator
