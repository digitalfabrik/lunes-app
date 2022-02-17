import React, { ComponentType, ReactElement } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled, { css } from 'styled-components/native'

import { BUTTONS_THEME, ButtonTheme } from '../constants/data'
import { Color, COLORS } from '../constants/theme/colors'

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
      border-color: ${props.theme.colors.lunesBlack};
      border-width: 1px;
    `};
  flex-direction: row;
  padding: ${props => `${wp('3%')}px ${props.theme.spacings.sm}`};

  width: ${wp('70%')}px;
  align-items: center;
  border-radius: ${hp('7%')}px;
  justify-content: center;
  margin-bottom: ${props => props.theme.spacings.sm};
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
  padding: ${props => `0 ${props.theme.spacings.xs}`};
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

  const getTextColor = (): Color => {
    const enabledTextColor = buttonTheme === BUTTONS_THEME.contained ? COLORS.lunesWhite : COLORS.lunesBlack
    return disabled ? COLORS.lunesBlackLight : enabledTextColor
  }

  const getBackgroundColor = (): Color | 'transparent' => {
    if (disabled) {
      return COLORS.lunesBlackUltralight
    }
    if (isPressed) {
      return buttonTheme === BUTTONS_THEME.contained ? COLORS.lunesBlackMedium : COLORS.lunesBlackLight
    }
    if (buttonTheme === BUTTONS_THEME.contained) {
      return COLORS.lunesBlack
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
      {props.iconLeft && (
        <props.iconLeft fill={getTextColor()} testID='button-icon-left' width={wp('6%')} height={wp('6%')} />
      )}
      <Label color={getTextColor()}>{label}</Label>
      {/* eslint-disable-next-line react/destructuring-assignment */}
      {props.iconRight && (
        <props.iconRight fill={getTextColor()} testID='button-icon-right' width={wp('6%')} height={wp('6%')} />
      )}
    </ThemedButton>
  )
}

export default Button
