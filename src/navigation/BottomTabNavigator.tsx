import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { ReactElement } from 'react'
import { isTablet } from 'react-native-device-info'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme } from 'styled-components/native'

import {
  HeartIconGrey,
  HeartIconWhite,
  HomeIconGrey,
  HomeIconWhite,
  MagnifierIconGrey,
  MagnifierIconWhite,
  RepeatIconGrey,
  RepeatIconWhite,
} from '../../assets/images'
import useRepetitionService from '../hooks/useRepetitionService'
import { getLabels } from '../services/helpers'
import DictionaryStackNavigator from './DictionaryStackNavigator'
import HomeStackNavigator from './HomeStackNavigator'
import { RoutesParams } from './NavigationTypes'
import RepetitionStackNavigator from './RepetitionStackNavigator'
import VocabularyCollectionTabNavigator from './VocabularyCollectionTabNavigator'

const Navigator = createBottomTabNavigator<RoutesParams>()

const BottomTabNavigator = (): ReactElement | null => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const iconSize = hp('3.5%')

  const repetitionService = useRepetitionService()
  const numberOfWordsNeedingRepetition = repetitionService.getNumberOfWordsNeedingRepetition()

  const renderHomeTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? <HomeIconWhite width={hp('5%')} height={hp('5%')} /> : <HomeIconGrey width={hp('5%')} height={hp('5%')} />

  const renderDictionaryTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <MagnifierIconWhite width={iconSize} height={iconSize} />
    ) : (
      <MagnifierIconGrey width={iconSize} height={iconSize} />
    )

  const renderRepetitionTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <RepeatIconWhite width={iconSize} height={iconSize} />
    ) : (
      <RepeatIconGrey width={iconSize} height={iconSize} />
    )

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
          minHeight: hp('7%') + insets.bottom,
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
        name='DictionaryTab'
        component={DictionaryStackNavigator}
        options={{ tabBarIcon: renderDictionaryTabIcon, title: getLabels().general.dictionary }}
      />
      <Navigator.Screen
        name='RepetitionTab'
        component={RepetitionStackNavigator}
        options={{
          tabBarIcon: renderRepetitionTabIcon,
          tabBarBadge: numberOfWordsNeedingRepetition > 0 ? numberOfWordsNeedingRepetition : undefined,
          title: getLabels().general.repetition,
        }}
      />
      <Navigator.Screen
        name='VocabularyCollection'
        component={VocabularyCollectionTabNavigator}
        options={{ tabBarIcon: renderUserVocabularyTabIcon, title: getLabels().userVocabulary.collection }}
      />
    </Navigator.Navigator>
  )
}

export default BottomTabNavigator
