import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

const Container = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin: ${props => `${props.theme.spacings.lg} 0 ${props.theme.spacings.xxs}`};
  padding: ${props =>
    `${props.theme.spacings.sm} ${props.theme.spacings.sm} ${props.theme.spacings.sm} ${props.theme.spacings.sm}`};
  background-color: ${props => props.theme.colors.background};
  border-top-color: ${prop => prop.theme.colors.disabled};
  border-top-width: 1px;
`

const ContentSecondary = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => props.theme.colors.textSecondary};
`

const LinkSecondary = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  color: ${props => props.theme.colors.textSecondary};
`

interface HomeFooterProps {
  navigateToImprint: () => void
}

const HomeFooter = ({ navigateToImprint }: HomeFooterProps): ReactElement => (
  <Container>
    <ContentSecondary>{'\u00A9'}LUNES2020</ContentSecondary>
    <LinkSecondary onPress={navigateToImprint}>Impressum</LinkSecondary>
  </Container>
)

export default HomeFooter
