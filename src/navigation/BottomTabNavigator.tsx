import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React from 'react'
import { SafeAreaView } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components/native'

import { HomeIconGrey, HomeIconWhite } from '../../assets/images'
import labels from '../constants/labels.json'
import HomeStackNavigator from './HomeStackNavigator'
import { RoutesParams } from './NavigationTypes'

const Navigator = createBottomTabNavigator<RoutesParams>()

const BottomTabNavigator = (): JSX.Element | null => {
  const theme = useTheme()

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigator.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.background,
          tabBarStyle: {
            backgroundColor: theme.colors.primary,
            height: wp('14%'),
            // TODO LUN-132: Delete
            display: 'none'
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
        {/* TODO LUN-132: Uncomment */}
        {/* <Navigator.Screen */}
        {/*  name='FavoritesTab' */}
        {/*  component={MockComponent} */}
        {/*  options={{ */}
        {/*    tabBarIcon: ({ focused }) => */}
        {/*      focused ? ( */}
        {/*        <StartIconWhite width={wp('7%')} height={wp('7%')} /> */}
        {/*      ) : ( */}
        {/*        <StartIconGrey width={wp('7%')} height={wp('7%')} /> */}
        {/*      ), */}
        {/*    title: labels.general.favorites */}
        {/*  }} */}
        {/* /> */}
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
    </SafeAreaView>
  )
}

export default BottomTabNavigator
