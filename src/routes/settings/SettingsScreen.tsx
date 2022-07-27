import React, { ReactElement, useState } from 'react'
import { Switch } from 'react-native'
import styled from 'styled-components/native'

import { Content, ContentTextLight } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
import labels from '../../constants/labels.json'
import AsyncStorage from '../../services/AsyncStorage'
import { reportError } from '../../services/sentry'
import DebugModal from './components/DebugModal'
import VersionPressable from './components/VersionPressable'
import RouteWrapper from '../../components/RouteWrapper'

const Container = styled.View`
  height: 100%;
`

const SettingsHeading = styled(Heading)`
  padding: ${props => props.theme.spacings.xl};
  text-align: center;
`

const ItemContainer = styled.View`
  margin: 0 ${props => props.theme.spacings.md};
  padding: ${props => props.theme.spacings.md};
  flex-direction: row;
  border: 1px solid ${props => props.theme.colors.disabled};
`

const ItemTextContainer = styled.View`
  flex: 2;
`

const SettingsScreen = (): ReactElement => {
  const [trackingEnabled, setTrackingEnabled] = useState<boolean>(true)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)

  AsyncStorage.isTrackingEnabled().then(setTrackingEnabled).catch(reportError)

  const onTrackingChange = async (): Promise<void> => {
    const newValue = !trackingEnabled
    setTrackingEnabled(newValue)
    return AsyncStorage.setIsTrackingEnabled(newValue)
  }

  return (
    <RouteWrapper>
      <DebugModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      <Container>
        <SettingsHeading>{labels.settings.settings}</SettingsHeading>
        <ItemContainer>
          <ItemTextContainer>
            <Content>{labels.settings.appStability}</Content>
            <ContentTextLight>{labels.settings.appStabilityExplanation}</ContentTextLight>
          </ItemTextContainer>
          <Switch testID='tracking-switch' value={trackingEnabled} onChange={onTrackingChange} />
        </ItemContainer>
        <VersionPressable onClickThresholdReached={() => setIsModalVisible(true)} />
      </Container>
    </RouteWrapper>
  )
}

export default SettingsScreen
