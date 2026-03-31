import React, { ReactElement } from 'react'
import { Platform, Share } from 'react-native'
import styled from 'styled-components/native'

import Button from '../../components/Button'
import ServerResponseHandler from '../../components/ServerResponseHandler'
import { BUTTONS_THEME } from '../../constants/data'
import useLoadAsync from '../../hooks/useLoadAsync'
import useStorage from '../../hooks/useStorage'
import { getAnalyticsExport } from '../../services/CmsApi'
import { getLabels } from '../../services/helpers'

const Container = styled.ScrollView`
  padding: ${props => props.theme.spacings.sm};
`

const CodeText = styled.Text`
  font-family: ${Platform.OS === 'ios' ? 'Menlo' : 'monospace'};
  font-size: ${props => props.theme.fonts.smallFontSize};
  color: ${props => props.theme.colors.text};
  background-color: ${props => props.theme.colors.backgroundLow};
  padding: ${props => props.theme.spacings.xs};
  border-radius: 4px;
  overflow: hidden;
`

const ButtonContainer = styled.View`
  align-items: center;
`

const GdprExportScreen = (): ReactElement => {
  const [installationId] = useStorage('installationId')
  const { loading, error, data, refresh } = useLoadAsync(getAnalyticsExport, installationId ?? '')

  const prettyData = JSON.stringify(data, undefined, 2)

  // React native does not provide a clipboard API, but the share API usually allows 'sharing' to the clipboard
  const copyData = async () => {
    await Share.share({ message: prettyData })
  }

  return (
    <ServerResponseHandler error={error} loading={loading} refresh={refresh}>
      {data !== null && (
        <Container>
          <ButtonContainer>
            <Button
              onPress={copyData}
              label={getLabels().settings.copyAnalyticsData}
              buttonTheme={BUTTONS_THEME.contained}
            />
          </ButtonContainer>
          <CodeText selectable>{prettyData}</CodeText>
        </Container>
      )}
    </ServerResponseHandler>
  )
}

export default GdprExportScreen
