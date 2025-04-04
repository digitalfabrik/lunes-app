import React, { ReactElement, useState } from 'react'
import { Switch } from 'react-native'
import styled from 'styled-components/native'

import RouteWrapper from '../../components/RouteWrapper'
import { Content, ContentTextLight } from '../../components/text/Content'
import { Heading } from '../../components/text/Heading'
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

  const [trackingEnabled, setTrackingEnabled] = useStorage('isTrackingEnabled')

  const onTrackingChange = async (): Promise<void> => {
    const newValue = !trackingEnabled
    await setTrackingEnabled(newValue)
  }

  return (
    <RouteWrapper>
      <DebugModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
      <SettingsHeading>{getLabels().settings.settings}</SettingsHeading>
      <ItemContainer>
        <ItemTextContainer>
          <Content>{getLabels().settings.appStability}</Content>
          <ContentTextLight>{getLabels().settings.appStabilityExplanation}</ContentTextLight>
        </ItemTextContainer>
        <Switch testID='tracking-switch' value={trackingEnabled} onChange={onTrackingChange} />
      </ItemContainer>
      <VersionPressable onClickThresholdReached={() => setIsModalVisible(true)} />
    </RouteWrapper>
  )
}

export default SettingsScreen
