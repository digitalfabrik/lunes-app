import React, { ReactElement, ReactNode } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Heading } from '../../../components/text/Heading'

const Icon = styled.Image`
  width: ${wp('7%')}px;
  height: ${wp('7%')}px;
`

const Box = styled.Pressable`
  background-color: ${props => props.theme.colors.backgroundAccent};
  border: 1px solid ${props => props.theme.colors.disabled};
  margin: ${props => props.theme.spacings.sm};
  padding: 0 ${props => props.theme.spacings.sm};
`

const BoxHeading = styled.View`
  border-bottom-color: ${props => props.theme.colors.disabled};
  border-bottom-width: 1px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} 0;
`

const Title = styled(Heading)`
  font-size: ${props => props.theme.fonts.largeFontSize};
`

const IconContainer = styled.View`
  padding-right: ${props => props.theme.spacings.sm};
`

interface PropsType {
  heading: string
  icon?: string | ReactElement
  onPress?: () => void
  children: ReactNode
}

const Card = (props: PropsType): ReactElement => {
  const { heading, icon, onPress, children } = props
  return (
    <Box onPress={onPress}>
      <BoxHeading>
        {icon && <IconContainer>{typeof icon === 'string' ? <Icon source={{ uri: icon }} /> : icon}</IconContainer>}
        <Title>{heading}</Title>
      </BoxHeading>
      {children}
    </Box>
  )
}

export default Card
