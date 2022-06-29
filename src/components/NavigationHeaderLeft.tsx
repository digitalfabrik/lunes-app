import React, { ReactElement, useState } from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import styled from 'styled-components/native'

import {
  ArrowLeftCircleIconBlue,
  ArrowLeftCircleIconWhite,
  CloseCircleIconBlue,
  CloseCircleIconWhite
} from '../../assets/images'
import { NavigationTitle } from './NavigationTitle'

const Container = styled.TouchableOpacity`
  padding-left: ${props => props.theme.spacings.sm};
  flex-direction: row;
  align-items: center;
`

interface Props {
  title: string
  onPress: () => void
  isCloseButton: boolean
}

const NavigationHeaderLeft = ({ onPress, title, isCloseButton }: Props): ReactElement => {
  const [pressed, setPressed] = useState<boolean>(false)

  const closeIcon = pressed ? CloseCircleIconBlue : CloseCircleIconWhite
  const backIcon = pressed ? ArrowLeftCircleIconBlue : ArrowLeftCircleIconWhite
  const Icon = isCloseButton ? closeIcon : backIcon

  return (
    <Container
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={1}>
      <Icon width={wp('7%')} height={wp('7%')} />
      <NavigationTitle numberOfLines={2}>{title}</NavigationTitle>
    </Container>
  )
}

export default NavigationHeaderLeft
