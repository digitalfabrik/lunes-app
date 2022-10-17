import React, { ReactElement, useState } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import {
  ArrowLeftCircleIconBlue,
  ArrowLeftCircleIconWhite,
  CloseCircleIconBlue,
  CloseCircleIconWhite,
} from '../../assets/images'
import { NavigationTitle } from './NavigationTitle'

const Container = styled.Pressable`
  padding-left: ${props => props.theme.spacings.sm};
  flex-direction: row;
  align-items: center;
`

interface NavigationHeaderLeftProps {
  title: string
  onPress: () => void
  isCloseButton: boolean
}

const NavigationHeaderLeft = ({ onPress, title, isCloseButton }: NavigationHeaderLeftProps): ReactElement => {
  const [pressed, setPressed] = useState<boolean>(false)

  const closeIcon = pressed ? CloseCircleIconBlue : CloseCircleIconWhite
  const backIcon = pressed ? ArrowLeftCircleIconBlue : ArrowLeftCircleIconWhite
  const Icon = isCloseButton ? closeIcon : backIcon

  return (
    <Container onPress={onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
      <Icon width={hp('3.5%')} height={hp('3.5%')} />
      <NavigationTitle numberOfLines={2}>{title}</NavigationTitle>
    </Container>
  )
}

export default NavigationHeaderLeft
