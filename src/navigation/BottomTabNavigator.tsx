import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { ReactElement } from 'react'
import { isTablet } from 'react-native-device-info'
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
const TAB_LABEL_FONT_SIZE = 12

const BottomTabNavigator = (): ReactElement | null => {
  const theme = useTheme()
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
      <HomeIconWhite width={theme.sizes.defaultIcon} height={theme.sizes.defaultIcon} />
    ) : (
      <HomeIconGrey width={theme.sizes.defaultIcon} height={theme.sizes.defaultIcon} />
    )

  const renderDictionaryTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <MagnifierIconWhite width={theme.sizes.defaultIcon} height={theme.sizes.defaultIcon} />
    ) : (
      <MagnifierIconGrey width={theme.sizes.defaultIcon} height={theme.sizes.defaultIcon} />
    )

  const renderRepetitionTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <RepeatIconWhite width={theme.sizes.defaultIcon} height={theme.sizes.defaultIcon} />
    ) : (
      <RepeatIconGrey width={theme.sizes.defaultIcon} height={theme.sizes.defaultIcon} />
    )

  const renderUserVocabularyTabIcon = ({ focused }: { focused: boolean }) =>
    focused ? (
      <HeartIconWhite width={theme.sizes.defaultIcon} height={theme.sizes.defaultIcon} />
    ) : (
      <HeartIconGrey width={theme.sizes.defaultIcon} height={theme.sizes.defaultIcon} />
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
          },
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
