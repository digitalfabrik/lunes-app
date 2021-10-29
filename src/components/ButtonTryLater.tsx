import React, { ReactElement } from 'react'
import styled from 'styled-components/native'

import { NextArrow } from '../../assets/images'
import Button from './Button'

const DarkLabel = styled.Text`
  text-align: center;
  color: ${props => props.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
`
const StyledArrow = styled(NextArrow)`
  margin-left: 5px;
`

interface ButtonTryLaterProps {
  text: string
  onPress: () => void
}

const ButtonTryLater: React.FC<ButtonTryLaterProps> = ({ text, onPress }: ButtonTryLaterProps): ReactElement => (
  <Button onPress={onPress} testID='try-later'>
    <>
      <DarkLabel>{text}</DarkLabel>
      <StyledArrow />
    </>
  </Button>
)

export default ButtonTryLater
