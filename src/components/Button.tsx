import React, { ComponentType, ReactElement } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled, { css, useTheme } from 'styled-components/native'

import { BUTTONS_THEME, ButtonTheme } from '../constants/data'
import { Color } from '../constants/theme/colors'

interface ThemedButtonProps {
  buttonTheme: ButtonTheme
  backgroundColor: Color | 'transparent'
  disabled?: boolean
}

interface ThemedLabelProps {
  color: string
}

const ThemedButton = styled.TouchableOpacity<ThemedButtonProps>`
  ${props =>
    props.buttonTheme === BUTTONS_THEME.outlined &&
    !props.disabled &&
    css`
      border-color: ${props.theme.colors.primary};
      border-width: 1px;
    `};
  flex-direction: row;
  padding: 10px 20px;
  width: ${wp('70%')}px;
  align-items: center;
  border-radius: ${hp('7%')}px;
  justify-content: center;
  height: ${hp('7%')}px;
  margin-bottom: ${hp('2%')}px;
  background-color: ${props => props.backgroundColor};
`

const Label = styled.Text<ThemedLabelProps>`
  color: ${props => props.color};
  text-align: center;
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  padding: 0 10px;
`

interface ButtonProps {
  onPress: () => void
  label: string
  buttonTheme: ButtonTheme
  disabled?: boolean
  iconLeft?: ComponentType<SvgProps>
  iconRight?: ComponentType<SvgProps>
}

const Button = (props: ButtonProps): ReactElement => {
  const [isPressed, setIsPressed] = React.useState(false)
  const { label, onPress, disabled = false, buttonTheme = BUTTONS_THEME.outlined } = props
  const theme = useTheme()

  const getTextColor = (): Color => {
    const enabledTextColor = buttonTheme === BUTTONS_THEME.contained ? theme.colors.background : theme.colors.primary
    return disabled ? theme.colors.placeholder : enabledTextColor
  }

  const getBackgroundColor = (): Color | 'transparent' => {
    if (disabled) {
      return theme.colors.disabled
    }
    if (isPressed) {
      return buttonTheme === BUTTONS_THEME.contained ? theme.colors.containedButtonSelected : theme.colors.placeholder
    }
    if (buttonTheme === BUTTONS_THEME.contained) {
      return theme.colors.primary
    }
    return 'transparent'
  }

  return (
    <ThemedButton
      buttonTheme={buttonTheme}
      testID='button'
      backgroundColor={getBackgroundColor()}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.iconLeft && <props.iconLeft fill={getTextColor()} testID='button-icon-left' />}
      <Label color={getTextColor()}>{label}</Label>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.iconRight && <props.iconRight fill={getTextColor()} testID='button-icon-right' />}
    </ThemedButton>
  )
}

export default Button
