import React, { ReactElement } from 'react'
import { BUTTONS_THEME } from '../constants/data'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { COLORS } from '../constants/colors'
import styled from 'styled-components/native'

const ButtonStyleTouchableOpacity = styled.TouchableOpacity`
  flex-direction: row;
  padding-top: 10;
  padding-bottom: 10;
  padding-left: 20;
  padding-right: 20;
  width: ${wp('70%')};
  align-items: center;
  border-radius: ${hp('7%')};
  justify-content: center;
  height: ${hp('7%')};
  margin-bottom: ${hp('2%')};
  background-color: ${(prop: IButtonProps) => prop.disabled ? COLORS.lunesBlackUltralight :
    prop.theme === BUTTONS_THEME.dark ? (prop.isPressed ? COLORS.lunesBlackMedium : COLORS.lunesBlack) : prop.theme === BUTTONS_THEME.light ? (prop.isPressed ? 'transparent' : COLORS.white ) : 'transparent'};
  border-color: ${(prop: IButtonProps) => (prop.theme === BUTTONS_THEME.light) ? COLORS.lunesBlack : COLORS.white};
  border-width: ${(prop: IButtonProps) => (prop.theme === BUTTONS_THEME.light) ? 1 : 0};
`;
export interface IButtonProps {
  onPress: () => void
  disabled?: boolean
  children: ReactElement
  theme?: string
  testID?: string
  isPressed: boolean
}

const Button = ({ children, onPress, disabled, theme }: IButtonProps) => {
  const [isPressed, setIsPressed] = React.useState(false)
  return (
    <ButtonStyleTouchableOpacity
      theme={theme}
      onPress={onPress}
      isPressed={isPressed}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}>
      {children}
    </ButtonStyleTouchableOpacity>
  )
}
export default Button