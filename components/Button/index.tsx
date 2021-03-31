import {
  React,
  TouchableOpacity,
  styles,
  IButtonProps,
  BUTTONS_THEME,
  COLORS,
} from './imports';

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
