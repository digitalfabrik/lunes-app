import React, { ComponentType, ReactElement, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled, { css, useTheme } from 'styled-components/native'

import { BUTTONS_THEME, ButtonTheme } from '../constants/data'
import { Color } from '../constants/theme/colors'
import { Subheading } from './text/Subheading'

interface ThemedButtonProps {
  buttonTheme: ButtonTheme
  backgroundColor: Color | 'transparent'
  disabled?: boolean
  isPressed: boolean
}

interface ThemedLabelProps {
  color: string
}

const ThemedButton = styled.Pressable<ThemedButtonProps>`
  ${props =>
    props.buttonTheme === BUTTONS_THEME.outlined &&
    !props.disabled &&
    css`
      border-color: ${props.theme.colors.primary};
      border-width: 1px;
    `};
  flex-direction: row;
  padding: ${props => `${hp('1.5%')}px ${props.theme.spacings.sm}`};
  width: ${wp('70%')}px;
  align-items: center;
  border-radius: ${hp('7%')}px;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacings.sm};
  background-color: ${props => props.backgroundColor};
  ${props =>
    props.buttonTheme === BUTTONS_THEME.text &&
    css`
      opacity: ${({ isPressed }: { isPressed: boolean }) =>
        isPressed ? props.theme.styles.pressOpacity.min : props.theme.styles.pressOpacity.max};
    `};
`

export const Label = styled(Subheading)<ThemedLabelProps>`
  color: ${props => props.color};
  text-align: center;
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  padding: ${props => `0 ${props.theme.spacings.xs}`};
`

interface ButtonProps {
  onPress: () => void
  label: string
  buttonTheme: ButtonTheme
  disabled?: boolean
  iconLeft?: ComponentType<SvgProps>
  iconRight?: ComponentType<SvgProps>
  style?: StyleProp<ViewStyle>
  iconSize?: number
}

const Button = (props: ButtonProps): ReactElement => {
  const [isPressed, setIsPressed] = useState<boolean>(false)
  const theme = useTheme()
  const {
    label,
    onPress,
    disabled = false,
    buttonTheme = BUTTONS_THEME.outlined,
    style,
    iconSize = theme.spacingsPlain.md,
  } = props

  const getTextColor = (): Color => {
    const enabledTextColor = buttonTheme === BUTTONS_THEME.contained ? theme.colors.background : theme.colors.primary
    return disabled ? theme.colors.placeholder : enabledTextColor
  }

  const getBackgroundColor = (): Color | 'transparent' => {
    if (disabled) {
      return buttonTheme === BUTTONS_THEME.text ? 'transparent' : theme.colors.disabled
    }
    if (isPressed) {
      if (buttonTheme === BUTTONS_THEME.text) {
        return 'transparent'
      }
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
      isPressed={isPressed}
      backgroundColor={getBackgroundColor()}
      onPress={onPress}
      disabled={disabled}
      style={style}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.iconLeft && (
        <props.iconLeft fill={getTextColor()} testID='button-icon-left' width={iconSize} height={iconSize} />
      )}
      <Label color={getTextColor()}>{label}</Label>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.iconRight && (
        <props.iconRight fill={getTextColor()} testID='button-icon-right' width={iconSize} height={iconSize} />
      )}
    </ThemedButton>
  )
}

export default Button
