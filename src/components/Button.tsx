import React, { ReactElement } from 'react'
import { BUTTONS_THEME, ButtonThemeType } from '../constants/data'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import styled, { css } from 'styled-components/native'

interface ThemedButtonProps {
  buttonTheme?: ButtonThemeType
  isPressed: boolean
  disabled?: boolean
}

const ThemedButton = styled.TouchableOpacity<ThemedButtonProps>`
  flex-direction: row;
  padding: 10px 20px;
  width: ${wp('70%')}px;
  align-items: center;
  border-radius: ${hp('7%')}px;
  justify-content: center;
  height: ${hp('7%')}px;
  margin-bottom: ${hp('2%')}px;

  ${props => {
    if (props.disabled) {
      return css`
        background-color: ${props.theme.colors.lunesBlackUltralight};
      `
    }
    if (props.isPressed) {
      return css`
        background-color: ${props.buttonTheme === BUTTONS_THEME.dark
          ? props.theme.colors.lunesBlackMedium
          : 'transparent'};
      `
    }
    if (props.buttonTheme === 'dark') {
      return css`
        background-color: ${props.theme.colors.lunesBlack};
      `
    }
  }};
  ${props =>
    props.buttonTheme === BUTTONS_THEME.light &&
    !props.disabled &&
    css`
      border-color: ${props.theme.colors.lunesBlack};
      border-width: 1px;
    `};
`

interface IButtonProps {
  onPress: () => void
  disabled?: boolean
  children: ReactElement
  buttonTheme?: ButtonThemeType
  testID?: string
}


const Button = ({ children, onPress, disabled = false, buttonTheme }: IButtonProps): ReactElement => {
  const [isPressed, setIsPressed] = React.useState(false)
  return (
    <ThemedButton
      buttonTheme={buttonTheme}
      onPress={onPress}
      isPressed={isPressed}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}>
      {children}
    </ThemedButton>
  )
}
export default Button
