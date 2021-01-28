import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    position: 'relative',
  },
  textInputContainer: {
    width: 260,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 2,
    paddingHorizontal: 10,
  },
  activeTextInput: {
    borderColor: COLORS.lunesBlack,
  },
  textInput: {
    height: 42,
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 0.11,
    fontFamily: 'SourceSansPro-Regular',
    color: COLORS.lunesBlack,
  },
  arrow: {
    backgroundColor: COLORS.lunesBlack,
  },
  overlay: {
    backgroundColor: 'transparent',
  },
  volumeIcon: {
    position: 'absolute',
    top: -20,
    left: '45%',
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: COLORS.lunesFunctionalIncorrectDark,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
