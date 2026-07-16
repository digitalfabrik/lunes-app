import React, { ReactElement, useState } from 'react'
import styled, { useTheme } from 'styled-components/native'

import { ArrowLeftCircleIcon, CloseCircleIcon } from '../../assets/images'
import { NavigationTitle } from './NavigationTitle'

const Container = styled.Pressable`
  padding-left: ${props => props.theme.spacings.sm};
  flex-direction: row;
  align-items: center;
`

type NavigationHeaderLeftProps = {
  title: string
  onPress: () => void
  isCloseButton: boolean
}

const NavigationHeaderLeft = ({ onPress, title, isCloseButton }: NavigationHeaderLeftProps): ReactElement => {
  const theme = useTheme()
  const [pressed, setPressed] = useState<boolean>(false)

  const Icon = isCloseButton ? CloseCircleIcon : ArrowLeftCircleIcon

  return (
    <Container onPress={onPress} onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
      <Icon
        width={theme.sizes.defaultIcon}
        height={theme.sizes.defaultIcon}
        fill={pressed ? theme.colors.containedButtonSelected : theme.colors.backgroundAccent}
        stroke={pressed ? theme.colors.containedButtonSelected : theme.colors.backgroundLightGrey}
        color={pressed ? theme.colors.background : theme.colors.primary}
      />
      <NavigationTitle numberOfLines={2}>{title}</NavigationTitle>
    </Container>
  )
}

export default NavigationHeaderLeft
