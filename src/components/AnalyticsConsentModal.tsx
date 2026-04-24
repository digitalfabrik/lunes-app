import React, { ReactElement } from 'react'
import { Modal as RNModal } from 'react-native'
import styled from 'styled-components/native'

import { BUTTONS_THEME } from '../constants/data'
import { getLabels } from '../services/helpers'
import Button from './Button'
import Link from './Link'
import { ContentSecondary } from './text/Content'
import { HeadingText } from './text/Heading'

const PRIVACY_NOTICE_URL = 'https://lunes.app/datenschutz-app/'

const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors.overlay};
`

const ModalContainer = styled.View`
  background-color: ${props => props.theme.colors.backgroundAccent};
  align-items: center;
  width: 85%;
  border-radius: 4px;
  padding: ${props => props.theme.spacings.lg};
`

const Title = styled(HeadingText)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacings.md};
`

const Body = styled(ContentSecondary)`
  text-align: center;
  margin-bottom: ${props => props.theme.spacings.md};
`

const LinkContainer = styled.View`
  margin-bottom: ${props => props.theme.spacings.lg};
`

type AnalyticsConsentModalProps = {
  visible: boolean
  onAllow: () => Promise<void>
  onDecline: () => Promise<void>
}

const AnalyticsConsentModal = ({ visible, onAllow, onDecline }: AnalyticsConsentModalProps): ReactElement => {
  const { consentDialog } = getLabels()

  return (
    <RNModal
      testID='analytics-consent-modal'
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onDecline}
    >
      <Overlay>
        <ModalContainer accessibilityViewIsModal>
          <Title>{consentDialog.title}</Title>
          <Body>{consentDialog.body}</Body>
          <LinkContainer>
            <Link url={PRIVACY_NOTICE_URL} text={consentDialog.privacyNotice} />
          </LinkContainer>
          <Button label={consentDialog.allow} onPress={onAllow} buttonTheme={BUTTONS_THEME.contained} />
          <Button label={consentDialog.decline} onPress={onDecline} buttonTheme={BUTTONS_THEME.outlined} />
        </ModalContainer>
      </Overlay>
    </RNModal>
  )
}

export default AnalyticsConsentModal
