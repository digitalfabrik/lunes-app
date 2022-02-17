import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

const Container = styled.View`
  min-height: ${hp('7%')}px;
  align-items: center;
  margin-bottom: ${props => props.theme.spacings.lg};
  margin-top: ${props => props.theme.spacings.lg};
  text-align: center;
`

const ScreenTitle = styled.Text`
  font-size: ${props => props.theme.fonts.headingFontSize};
  color: ${props => props.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
  text-align: center;
  padding: ${props => props.theme.spacings.xs};
`

const ScreenSubTitle = styled.Text`
  margin-top: ${props => props.theme.spacings.xs};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  color: ${prop => prop.theme.colors.lunesGreyDark};
  font-family: ${props => props.theme.fonts.contentFontBold};
`

const Description = styled.Text`
  margin-top: ${props => props.theme.spacings.xxs};
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

const Title = ({ titleIcon, title, subtitle, description, children }: ITitleProps): ReactElement => (
  <Container>
    {titleIcon}
    <ScreenTitle>{title}</ScreenTitle>
    {subtitle && <ScreenSubTitle>{subtitle}</ScreenSubTitle>}
    <Description>{description}</Description>
    {children}
  </Container>
)
export default Title
