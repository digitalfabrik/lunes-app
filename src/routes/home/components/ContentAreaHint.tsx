import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { ArrowRightIcon } from '../../../../assets/images'
import Button from '../../../components/Button'
import { Content } from '../../../components/text/Content'
import { Subheading } from '../../../components/text/Subheading'
import { BUTTONS_THEME } from '../../../constants/data'
import { ContentAreaHint as ContentAreaHintType } from '../../../models/ContentArea'
import { getLabels } from '../../../services/helpers'
import { openExternalUrl } from '../../../services/url'

const Container = styled.View`
  background-color: ${props => props.theme.colors.backgroundLow};
  border-left-width: ${props => props.theme.spacings.xxs};
  border-left-color: ${props => props.theme.colors.backgroundHeader};
  border-top-right-radius: ${props => props.theme.spacings.sm};
  border-bottom-right-radius: ${props => props.theme.spacings.sm};
  gap: ${props => props.theme.spacings.xs};
  padding: ${props => props.theme.spacings.sm};
`

const LinkButton = styled(Button)`
  align-self: flex-start;
  border-color: ${props => props.theme.colors.backgroundHeader};
`

type ContentAreaHintProps = {
  hint: ContentAreaHintType
}

const ContentAreaHint = ({ hint }: ContentAreaHintProps): ReactElement => {
  const { title, text, url, urlLabel } = hint
  return (
    <Container testID='content-area-hint'>
      {title !== undefined && <Subheading>{title}</Subheading>}
      <Content>{text}</Content>
      {url !== undefined && (
        <LinkButton
          testID='content-area-hint-link'
          onPress={() => openExternalUrl(url)}
          label={urlLabel ?? getLabels().home.contentAreaHintLink}
          buttonTheme={BUTTONS_THEME.outlined}
          iconRight={ArrowRightIcon}
          accessibilityRole='link'
          fitToContentWidth
        />
      )}
    </Container>
  )
}

export default ContentAreaHint
