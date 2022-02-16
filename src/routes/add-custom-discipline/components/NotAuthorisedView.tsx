import React, { ReactElement } from 'react'
import { Linking } from 'react-native'
import styled from 'styled-components/native'

import Button from '../../../components/Button'
import { BUTTONS_THEME } from '../../../constants/data'
import labels from '../../../constants/labels.json'

const Container = styled.View`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: ${props => props.theme.colors.lunesWhite};
  margin: 50px 0 0;
`

const Description = styled.Text`
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.lunesGreyMedium};
  padding: 0 20px 20px;
  text-align: center;
`

interface Props {
  setVisible: (visible: boolean) => void
}

const NotAuthorisedView = ({ setVisible }: Props): ReactElement => {
  const openSettings = () => {
    Linking.openSettings().catch(() => console.error('Unable to open Settings'))
  }

  return (
    <Container>
      <Description>{labels.addCustomDiscipline.qrCodeScanner.noAuthorization.description}</Description>
      <Button
        onPress={() => setVisible(false)}
        label={labels.addCustomDiscipline.qrCodeScanner.noAuthorization.back}
        buttonTheme={BUTTONS_THEME.outlined}
      />
      <Button
        onPress={() => openSettings()}
        label={labels.addCustomDiscipline.qrCodeScanner.noAuthorization.settings}
        buttonTheme={BUTTONS_THEME.contained}
      />
    </Container>
  )
}

export default NotAuthorisedView
