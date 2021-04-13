import React from 'react';
import {TouchableOpacity} from 'react-native';
import {IButtonProps} from '../interfaces';
import {BUTTONS_THEME} from '../constants/data';
import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {COLORS} from '../constants/colors';

const buttonBase: any = {
  flexDirection: 'row',
  paddingVertical: 10,
  paddingHorizontal: 20,
  width: wp('70%'),
  alignItems: 'center',
  borderRadius: hp('7%'),
  justifyContent: 'center',
  height: hp('7%'),
  marginBottom: hp('2%'),
};

export const styles = StyleSheet.create({
  button: {
    ...buttonBase,
  },
  darkButton: {
    ...buttonBase,
    backgroundColor: COLORS.lunesBlack,
  },
  lightButton: {
    ...buttonBase,
    borderWidth: 1,
    borderColor: COLORS.lunesBlack,
  },
  disabledButton: {
    ...buttonBase,
    backgroundColor: COLORS.lunesBlackUltralight,
  },
});

const Button = ({children, onPress, disabled, theme}: IButtonProps) => {
  const [isPressed, setIsPressed] = React.useState(false);

  const buttonStyle = disabled
    ? [styles.darkButton, styles.disabledButton]
    : theme === BUTTONS_THEME.light
    ? styles.lightButton
    : theme === BUTTONS_THEME.dark
    ? styles.darkButton
    : styles.button;

  const pressedButtonBackground =
    theme === BUTTONS_THEME.dark ? COLORS.lunesBlackMedium : 'transparent';

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        isPressed && {backgroundColor: pressedButtonBackground},
      ]}
      onPress={onPress}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={1}>
      {children}
    </TouchableOpacity>
  );
};

export default Button;
