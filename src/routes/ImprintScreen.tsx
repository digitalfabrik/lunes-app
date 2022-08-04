import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import Link from '../components/Link'
import RouteWrapper from '../components/RouteWrapper'
import { ContentText } from '../components/text/Content'
import { HeadingText } from '../components/text/Heading'
import { Subheading } from '../components/text/Subheading'

const Root = styled.View`
  background-color: ${prop => prop.theme.colors.background};
  height: 100%;
  width: 100%;
  padding: ${props => props.theme.spacings.sm};
`

const Description = styled(ContentText)`
  margin-bottom: ${props => props.theme.spacings.xs};
`

const Title = styled(HeadingText)`
  margin: ${props => props.theme.spacings.sm} 0;
`

const MultiTextContainer = styled.View`
  flex-direction: row;
`

const ImprintScreen = (): ReactElement => (
  <RouteWrapper>
    <Root>
      <Title>Impressum</Title>
      <Description>Angaben gemäß § 5 TMG und verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</Description>
      <Description>Tür an Tür – Digitalfabrik gGmbH Wertachstr. 29 86153 Augsburg</Description>
      <Description>vertreten durch Herrn Daniel Kehne, Herrn Fritjof Knier</Description>
      <Subheading>Aufsichtsbehörde:</Subheading>
      <Description>Finanzamt Augsburg-Stadt</Description>
      <Subheading>Sitz der Gesellschaft:</Subheading>
      <Description>Augsburg</Description>
      <Subheading>Handelsregister und Registernummer:</Subheading>
      <Description>HRB30759</Description>
      <Subheading>Umsatzsteuer-Identifikationsnummer:</Subheading>
      <Description>DE307491397</Description>
      <Subheading>Kontakt</Subheading>
      <MultiTextContainer>
        <ContentText>Telefon: </ContentText>
        <Link text='0821 20990556' url='tel:082120990556' />
      </MultiTextContainer>
      <MultiTextContainer>
        <ContentText>E-Mail: </ContentText>
        <Link text='digitalfabrik@tuerantuer.de' url='mailto:digitalfabrik@tuerantuer.de' />
      </MultiTextContainer>
    </Root>
  </RouteWrapper>
)

export default ImprintScreen
