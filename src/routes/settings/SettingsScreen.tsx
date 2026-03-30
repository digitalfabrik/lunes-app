import React, { ReactElement, useState } from 'react'
import { Switch } from 'react-native'
import styled from 'styled-components/native'

import Button from '../../components/Button'
import RouteWrapper from '../../components/RouteWrapper'
import { Content, ContentTextLight } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import { BUTTONS_THEME } from '../../constants/data'
import useStorage from '../../hooks/useStorage'
import { getLabels } from '../../services/helpers'
import DebugModal from './components/DebugModal'
import VersionPressable from './components/VersionPressable'

const SettingsHeading = styled(Heading)`
  padding: ${props => props.theme.spacings.xl};
  text-align: center;
`

const ItemContainer = styled.View`
  margin: 0 ${props => props.theme.spacings.md};
  padding: ${props => props.theme.spacings.md};
  flex-direction: row;
  background-color: ${props => props.theme.colors.backgroundAccent};
  border: 1px solid ${props => props.theme.colors.disabled};
`

const ItemTextContainer = styled.View`
  flex: 2;
`

const SettingsScreen = (): ReactElement => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  const [analyticsConsent, setAnalyticsConsent] = useStorage('analyticsConsent')
  const [isDevModeEnabled] = useStorage('isDevModeEnabled')

  const {
    settings,
    analyticsConsent: analyticsConsentLabel,
    analyticsConsentExplanation,
    devSettings,
  } = getLabels().settings

  const isAnalyticsConsentGiven = analyticsConsent?.consentGiven ?? false

  const onAnalyticsConsentToggle = async (newConsentGiven: boolean): Promise<void> => {
    await setAnalyticsConsent({ consentGiven: newConsentGiven, consentDate: new Date().toISOString() })
  }

  return (
    <RouteWrapper>
      <DebugModal
        isCodeRequired={!isDevModeEnabled}
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <SettingsHeading>{settings}</SettingsHeading>
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
      {isDevModeEnabled && (
        <ItemContainer>
          <Button onPress={() => setIsModalVisible(true)} label={devSettings} buttonTheme={BUTTONS_THEME.contained} />
        </ItemContainer>
      )}
      <VersionPressable onClickThresholdReached={() => setIsModalVisible(true)} />
    </RouteWrapper>
  )
}

export default SettingsScreen
