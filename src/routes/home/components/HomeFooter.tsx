import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { ContentSecondary } from '../../../components/text/Content'
import { getLabels } from '../../../services/helpers'

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding: ${props =>
    `${props.theme.spacings.sm} ${props.theme.spacings.sm} ${props.theme.spacings.sm} ${props.theme.spacings.sm}`};
  background-color: ${props => props.theme.colors.background};
  border-top-color: ${prop => prop.theme.colors.disabled};
  border-top-width: 1px;
`

interface HomeFooterProps {
  navigateToImprint: () => void
}

const HomeFooter = ({ navigateToImprint }: HomeFooterProps): ReactElement => (
  <Container>
    <ContentSecondary>{'\u00A9'}LUNES2022</ContentSecondary>
    <ContentSecondary onPress={navigateToImprint}>{getLabels().home.impressum}</ContentSecondary>
  </Container>
)

export default HomeFooter
