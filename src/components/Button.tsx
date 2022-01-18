import React, { ComponentType, ReactElement } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled, { css } from 'styled-components/native'

import { BUTTONS_THEME, ButtonThemeType } from '../constants/data'
import { Color, COLORS } from '../constants/theme/colors'

interface ThemedButtonProps {
  buttonTheme: ButtonThemeType
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

interface ButtonPropsType {
  onPress: () => void
  label: string
  buttonTheme: ButtonThemeType
  disabled?: boolean
  iconLeft?: ComponentType<SvgProps>
  iconRight?: ComponentType<SvgProps>
  testID?: string
}

const Button = (props: ButtonPropsType): ReactElement => {
  const [isPressed, setIsPressed] = React.useState(false)
  const { label, onPress, disabled = false, buttonTheme = BUTTONS_THEME.outlined, testID } = props

  const getTextColor = (): Color => {
    const enabledTextColor = buttonTheme === BUTTONS_THEME.contained ? COLORS.lunesWhite : COLORS.lunesBlack
    return disabled ? COLORS.lunesBlackLight : enabledTextColor
  }

  const getBackgroundColor = (): Color | 'transparent' => {
    if (props.disabled) {
      return COLORS.lunesBlackUltralight
    }
    if (isPressed) {
      return props.buttonTheme === BUTTONS_THEME.contained ? COLORS.lunesBlackMedium : COLORS.lunesBlackLight
    }
    if (buttonTheme === BUTTONS_THEME.contained) {
      return COLORS.lunesBlack
    }
    return 'transparent'
  }

  return (
    <ThemedButton
      buttonTheme={buttonTheme}
      testID={testID}
      backgroundColor={getBackgroundColor()}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}>
      {props.iconLeft && <props.iconLeft fill={getTextColor()} testID={'button-icon-left'} />}
      <Label color={getTextColor()}>{label}</Label>
      {props.iconRight && <props.iconRight fill={getTextColor()} testID={'button-icon-right'} />}
    </ThemedButton>
  )
}

export default Button
