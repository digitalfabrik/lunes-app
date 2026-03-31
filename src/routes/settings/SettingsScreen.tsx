import { StackNavigationProp } from '@react-navigation/stack'
import React, { ReactElement, useState } from 'react'
import { Switch } from 'react-native'
import styled from 'styled-components/native'

import Button from '../../components/Button'
import Modal from '../../components/Modal'
import PressableOpacity from '../../components/PressableOpacity'
import RouteWrapper from '../../components/RouteWrapper'
import { Content, ContentText, ContentTextLight } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import useStorage from '../../hooks/useStorage'
import { RoutesParams } from '../../navigation/NavigationTypes'
import { deleteAnalyticsData } from '../../services/CmsApi'
import { getLabels } from '../../services/helpers'
import DebugModal from './components/DebugModal'
import VersionPressable from './components/VersionPressable'

const SettingsHeading = styled(Heading)`
  padding: ${props => props.theme.spacings.xl};
  text-align: center;
`

const SettingsOutline = styled.View`
  margin: 0 ${props => props.theme.spacings.md};
  padding: ${props => props.theme.spacings.md};
  background-color: ${props => props.theme.colors.backgroundAccent};
  border: 1px solid ${props => props.theme.colors.disabled};
`

const ItemContainer = styled.View`
  flex-direction: row;
`

const ItemTextContainer = styled.View`
  flex: 2;
`

const GdprControls = styled.View`
  padding-top: ${props => props.theme.spacings.sm};
`

type SettingsScreenProps = {
  navigation: StackNavigationProp<RoutesParams, 'Settings'>
}

const SettingsScreen = ({ navigation }: SettingsScreenProps): ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [deletionModalText, setDeletionModalText] = useState<string | null>(null)

  const [analyticsConsent, setAnalyticsConsent] = useStorage('analyticsConsent')
  const [installationId] = useStorage('installationId')
  const [isDevModeEnabled] = useStorage('isDevModeEnabled')

  const {
    settings,
    analyticsConsent: analyticsConsentLabel,
    analyticsConsentExplanation,
    devSettings,
    requestAnalyticsData,
    deleteAnalyticsData: deleteAnalyticsDataLabel,
    deleteAnalyticsDataSuccess,
    deleteAnalyticsDataError,
  } = getLabels().settings

  const isAnalyticsConsentGiven = analyticsConsent?.consentGiven ?? false

  const onAnalyticsConsentToggle = async (newConsentGiven: boolean): Promise<void> => {
    await setAnalyticsConsent({ consentGiven: newConsentGiven, consentDate: new Date().toISOString() })
  }

  const onDeleteAnalyticsData = async (): Promise<void> => {
    try {
      await deleteAnalyticsData(installationId ?? '')
      setDeletionModalText(deleteAnalyticsDataSuccess)
    } catch {
      setDeletionModalText(deleteAnalyticsDataError)
    }
  }

  const closeDeletionModal = (): void => {
    setDeletionModalText(null)
  }

  return (
    <RouteWrapper>
      <DebugModal
        isCodeRequired={!isDevModeEnabled}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <Modal
        visible={deletionModalText !== null}
        onClose={closeDeletionModal}
        text={deletionModalText ?? ''}
        confirmationButtonText={getLabels().general.back}
        confirmationAction={closeDeletionModal}
        showCancelButton={false}
      />
      <SettingsHeading>{settings}</SettingsHeading>
      <SettingsOutline>
        <ItemContainer>
          <ItemTextContainer>
            <Content>{analyticsConsentLabel}</Content>
            <ContentTextLight>{analyticsConsentExplanation}</ContentTextLight>
          </ItemTextContainer>
          <Switch
            testID='analytics-consent-switch'
            value={isAnalyticsConsentGiven}
            onValueChange={onAnalyticsConsentToggle}
          />
        </ItemContainer>
        {isAnalyticsConsentGiven && (
          <GdprControls>
            <PressableOpacity onPress={() => navigation.navigate('GdprExport')}>
              <ContentText>{requestAnalyticsData}</ContentText>
            </PressableOpacity>
            <PressableOpacity onPress={onDeleteAnalyticsData}>
              <ContentText>{deleteAnalyticsDataLabel}</ContentText>
            </PressableOpacity>
          </GdprControls>
        )}
      </SettingsOutline>
      {isDevModeEnabled && (
        <SettingsOutline>
          <ItemContainer>
            <Button onPress={() => setIsModalVisible(true)} label={devSettings} buttonTheme={BUTTONS_THEME.contained} />
          </ItemContainer>
        </SettingsOutline>
      )}
      <VersionPressable onClickThresholdReached={() => setIsModalVisible(true)} />
    </RouteWrapper>
  )
}

export default SettingsScreen
