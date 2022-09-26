import React, { ReactElement } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled from 'styled-components/native'

import { ContentSecondary } from './text/Content'
import { HeadingText } from './text/Heading'
import { SubheadingText } from './text/Subheading'

const Container = styled.View`
  min-height: ${hp('7%')}px;
  align-items: center;
  margin-bottom: ${props => props.theme.spacings.lg};
  margin-top: ${props => props.theme.spacings.lg};
  text-align: center;
`

const TitleContent = styled(ContentSecondary)`
  margin-top: ${props => props.theme.spacings.xxs};
`

const TitleHeading = styled(HeadingText)`
  padding: ${props => props.theme.spacings.xs};
  text-align: center;
`

const TitleSubheading = styled(SubheadingText)`
  margin-top: ${props => props.theme.spacings.xs};
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
    <TitleHeading>{title}</TitleHeading>
    {subtitle && <TitleSubheading>{subtitle}</TitleSubheading>}
    <TitleContent>{description}</TitleContent>
    {children}
  </Container>
)
export default Title
