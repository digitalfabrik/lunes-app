import React, { ReactElement } from 'react'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

const Container = styled.View`
  min-height: 54px;
  align-items: center;
  margin-bottom: 32px;
  margin-top: 32px;
  text-align: center;
`

const ScreenTitle = styled.Text`
  font-size: ${props => props.theme.fonts.headingFontSize};
  color: ${props => props.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
`

const ScreenSubTitle = styled.Text`
  margin-top: 25px;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${prop => prop.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
`

const Description = styled.Text`
  margin-top: 4px;
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${props => props.theme.colors.lunesGreyMedium};
  font-family: ${props => props.theme.fonts.contentFontRegular};
`

interface ITitleProps {
  titleIcon?: ReactElement<SvgProps>
  title: string
  subtitle?: string
  description: string
  children?: ReactElement
}

const ListTitle = ({ titleIcon, title, subtitle, description, children }: ITitleProps): ReactElement => (
  <Container>
    {titleIcon}
    <ScreenTitle>{title}</ScreenTitle>
    {subtitle && <ScreenSubTitle>{subtitle}</ScreenSubTitle>}
    <Description>{description}</Description>
    {children}
  </Container>
)
export default ListTitle
