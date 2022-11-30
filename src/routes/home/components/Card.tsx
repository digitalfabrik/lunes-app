import React, { ReactElement, ReactNode } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import { Heading } from '../../../components/text/Heading'

const Icon = styled.Image`
  width: ${hp('3.5%')}px;
  height: ${hp('3.5%')}px;
`

const Box = styled.Pressable`
  background-color: ${props => props.theme.colors.backgroundAccent};
  border: 1px solid ${props => props.theme.colors.disabled};
  display: flex;
  justify-content: space-between;
  margin: ${props => props.theme.spacings.sm};
  padding: 0 ${props => props.theme.spacings.sm};
  min-height: ${hp('28%')}px;
`

const BoxHeading = styled.View`
  border-bottom-color: ${props => props.theme.colors.disabled};
  border-bottom-width: 1px;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${props => props.theme.spacings.sm} ${props => props.theme.spacings.sm} ${props => props.theme.spacings.sm} 0;
`

const Title = styled(Heading)`
  font-size: ${props => props.theme.fonts.largeFontSize};
  padding-right: ${props => props.theme.spacings.sm};
`

const IconContainer = styled.View`
  padding-right: ${props => props.theme.spacings.sm};
`

type CardProps = {
  heading?: string
  icon?: string | ReactElement
  onPress?: () => void
  children: ReactNode
}

const Card = (props: CardProps): ReactElement => {
  const { heading, icon, onPress, children } = props
  return (
    <Box onPress={onPress}>
      {(!!icon || !!heading) && (
        <BoxHeading>
          {!!icon && <IconContainer>{typeof icon === 'string' ? <Icon source={{ uri: icon }} /> : icon}</IconContainer>}
          {!!heading && <Title>{heading}</Title>}
        </BoxHeading>
      )}
      {children}
    </Box>
  )
}

export default Card
