import React, { ReactElement } from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'

import { BUTTONS_THEME } from '../constants/data'
import { getLabels } from '../services/helpers'
import { reportError } from '../services/sentry'
import Button from './Button'
import { ContentSecondary } from './text/Content'

const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const Description = styled(ContentSecondary)`
  padding: ${props => `0 ${props.theme.spacings.md} ${props.theme.spacings.md}`};
  text-align: center;
`

type NotAuthorizedViewProps = {
  setVisible: (visible: boolean) => void
}

const NotAuthorisedView = ({ setVisible }: NotAuthorizedViewProps): ReactElement => {
  const openSettings = () => {
    Linking.openSettings().catch(reportError)
  }

  return (
    <Container testID='no-auth'>
      <Description>{getLabels().general.camera.noAuthorization.description}</Description>
      <Button onPress={() => setVisible(false)} label={getLabels().general.back} buttonTheme={BUTTONS_THEME.outlined} />
      <Button
        onPress={openSettings}
        label={getLabels().general.camera.noAuthorization.settings}
        buttonTheme={BUTTONS_THEME.contained}
      />
    </Container>
  )
}

export default NotAuthorisedView
