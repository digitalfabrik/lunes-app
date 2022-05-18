import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components/native'

import {
  BookOutlineIconGrey,
  BookOutlineIconWhite,
  HeartOutlineIconGrey,
  HeartOutlineIconWhite,
  HomeOutlineIconGrey,
  HomeOutlineIconWhite,
  StarOutlineIconGrey,
  StarOutlineIconWhite
} from '../../assets/images'
import HomeStackNavigator from './HomeStackNavigator'

const BottomTabNavigator = createBottomTabNavigator()

// TODO LUN-132, LUN-207, LUN-308: Remove this and use actual components
const MockComponent = () => <></>

const Navigator = (): JSX.Element | null => {
  const theme = useTheme()

  return (
    <NavigationContainer>
      <BottomTabNavigator.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.background,
          tabBarStyle: { backgroundColor: theme.colors.primary, height: wp('14%') },
          tabBarItemStyle: { height: wp('14%'), padding: wp('2%') },
          tabBarLabelStyle: { fontSize: wp('3%') }
        }}>
        <BottomTabNavigator.Screen
          name='home'
          component={HomeStackNavigator}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <HomeOutlineIconWhite width={wp('10%')} height={wp('10%')} />
              ) : (
                <HomeOutlineIconGrey width={wp('10%')} height={wp('10%')} />
              ),
            title: 'Home'
          }}
        />
        <BottomTabNavigator.Screen
          name='Favoriten'
          component={MockComponent}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <StarOutlineIconWhite width={wp('7%')} height={wp('7%')} />
              ) : (
                <StarOutlineIconGrey width={wp('7%')} height={wp('7%')} />
              )
          }}
        />
        <BottomTabNavigator.Screen
          name='Lexikon'
          component={MockComponent}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <BookOutlineIconWhite width={wp('7%')} height={wp('7%')} />
              ) : (
                <BookOutlineIconGrey width={wp('7%')} height={wp('7%')} />
              )
          }}
        />
        <BottomTabNavigator.Screen
          name='Meine vokabeln'
          component={MockComponent}
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <HeartOutlineIconWhite width={wp('6%')} height={wp('6%')} />
              ) : (
                <HeartOutlineIconGrey width={wp('6%')} height={wp('6%')} />
              )
          }}
        />
      </BottomTabNavigator.Navigator>
    </NavigationContainer>
  )
}

export default Navigator
