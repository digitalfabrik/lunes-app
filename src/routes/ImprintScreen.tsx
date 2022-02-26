import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import Link from '../components/Link'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
  width: 100%;
`

const Container = styled.View`
  margin: ${props => props.theme.spacings.sm};
`

const Description = styled.Text`
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-family: ${props => props.theme.fonts.contentFontRegular};
  font-weight: ${props => props.theme.fonts.lightFontWeight};
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacings.xs};
`

const Title = styled.Text`
  text-align: left;
  font-size: ${props => props.theme.fonts.headingFontSize};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  margin: ${props => props.theme.spacings.sm} 0;
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => props.theme.colors.text};
`

const Subheading = styled.Text`
  text-align: left;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  letter-spacing: ${props => props.theme.fonts.listTitleLetterSpacing};
  font-family: ${props => props.theme.fonts.contentFontBold};
  color: ${props => props.theme.colors.text};
`

const StyledLink = styled(Link)`
  color: blue;
`

const ImprintScreen = (): ReactElement => (
  <Root>
    <Container>
      <Title>Impressum</Title>
      <Description>Angaben gemäß § 5 TMG und verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</Description>
      <Description>Tür an Tür – Digitalfabrik gGmbH Wertachstr. 29 86153 Augsburg</Description>
      <Description>vertreten durch Herrn Daniel Kehne, Herrn Fritjof Knier</Description>
      <Subheading>Aufsichtsbehörde</Subheading>
      <Description>
        Finanzamt Augsburg-Stadt Sitz der Gesellschaft: Augsburg Handelsregister und Registernummer: HRB30759
        Umsatzsteuer-Identifikationsnummer: DE307491397
      </Description>
      <Subheading>Kontakt</Subheading>
      <Description>Telefon:</Description>
      <StyledLink text='0821 20990556' url='tel:082120990556' />
      <Description>E-Mail: digitalfabrik@tuerantuer.de</Description>
      <StyledLink text='digitalfabrik@tuerantuer.de' url='mailto:digitalfabrik@tuerantuer.de' />
    </Container>
  </Root>
)

export default ImprintScreen
