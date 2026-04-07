import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { ReactElement } from 'react'
import { isTablet } from 'react-native-device-info'
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
import AnalyticsConsentModal from '../components/AnalyticsConsentModal'
import useRepetitionService from '../hooks/useRepetitionService'
import useStorage from '../hooks/useStorage'
import { getLabels } from '../services/helpers'
import DictionaryStackNavigator from './DictionaryStackNavigator'
import HomeStackNavigator from './HomeStackNavigator'
import { RoutesParams } from './NavigationTypes'
import RepetitionStackNavigator from './RepetitionStackNavigator'
import VocabularyCollectionTabNavigator from './VocabularyCollectionTabNavigator'

const Navigator = createBottomTabNavigator<RoutesParams>()
const TAB_BAR_HEIGHT = 56
const TAB_ICON_SIZE = 28
const HOME_TAB_ICON_SIZE = 40
const TAB_LABEL_FONT_SIZE = 12

const BottomTabNavigator = (): ReactElement | null => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const repetitionService = useRepetitionService()
  const [analyticsConsent, setAnalyticsConsent] = useStorage('analyticsConsent')

  const handleAllow = async (): Promise<void> => {
    await setAnalyticsConsent({ consentGiven: true, consentDate: new Date().toISOString() })
  }

  const handleDecline = async (): Promise<void> => {
    await setAnalyticsConsent({ consentGiven: false, consentDate: new Date().toISOString() })
  }
  const numberOfWordsNeedingRepetition = repetitionService.getNumberOfWordsNeedingRepetition()

  const renderHomeTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <HomeIconWhite width={HOME_TAB_ICON_SIZE} height={HOME_TAB_ICON_SIZE} />
    ) : (
      <HomeIconGrey width={HOME_TAB_ICON_SIZE} height={HOME_TAB_ICON_SIZE} />
    )

  const renderDictionaryTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <MagnifierIconWhite width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
    ) : (
      <MagnifierIconGrey width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
    )

  const renderRepetitionTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <RepeatIconWhite width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
    ) : (
      <RepeatIconGrey width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
    )

  const renderUserVocabularyTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <HeartIconWhite width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
    ) : (
      <HeartIconGrey width={TAB_ICON_SIZE} height={TAB_ICON_SIZE} />
    )

  return (
    <>
      <AnalyticsConsentModal visible={analyticsConsent === null} onAllow={handleAllow} onDecline={handleDecline} />
      <Navigator.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: theme.colors.background,
          tabBarStyle: {
            backgroundColor: theme.colors.primary,
            minHeight: TAB_BAR_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
          },
          tabBarItemStyle: { height: TAB_BAR_HEIGHT, padding: theme.spacingsPlain.xs },
          tabBarLabelStyle: { fontSize: TAB_LABEL_FONT_SIZE, paddingLeft: isTablet() ? theme.spacingsPlain.xs : 0 },
        }}
      >
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
    </>
  )
}

export default BottomTabNavigator
