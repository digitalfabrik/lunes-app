import React, { ComponentType, ReactElement } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'
import styled, { css } from 'styled-components/native'

import { BUTTONS_THEME, ButtonThemeType } from '../constants/data'
import { Color, COLORS } from '../constants/theme/colors'

interface ThemedButtonProps {
  buttonTheme: ButtonThemeType
  backgroundColor: Color | null
  disabled?: boolean
}

interface ThemedLabelProps {
  color: string
}

const ThemedButton = styled.TouchableOpacity<ThemedButtonProps>`
  ${props =>
    props.buttonTheme === BUTTONS_THEME.light &&
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
  const { label, onPress, disabled = false, buttonTheme = BUTTONS_THEME.light, testID } = props
  let textColor = buttonTheme === BUTTONS_THEME.dark ? COLORS.lunesWhite : COLORS.lunesBlack
  if (disabled) {
    textColor = COLORS.lunesBlackLight
  }

  const getBackgroundColor = (): Color | 'transparent' => {
    if (props.disabled) {
      return COLORS.lunesBlackUltralight
    }
    if (isPressed) {
      return props.buttonTheme === BUTTONS_THEME.dark ? COLORS.lunesBlackMedium : COLORS.lunesBlackLight
    }
    if (buttonTheme === 'dark') {
      return COLORS.lunesBlack
    } else {
      return 'transparent'
    }
  }
  const backgroundColor = getBackgroundColor()

  return (
    <ThemedButton
      buttonTheme={buttonTheme}
      testID={testID}
      backgroundColor={backgroundColor}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}>
      {props.iconLeft && <props.iconLeft fill={textColor} accessibilityLabel={'button-icon-left'} />}
      <Label color={textColor}>{label}</Label>
      {props.iconRight && <props.iconRight fill={textColor} accessibilityLabel={'button-icon-right'} />}
    </ThemedButton>
  )
}

export default Button
