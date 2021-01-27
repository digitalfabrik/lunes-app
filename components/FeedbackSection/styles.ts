import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: 'center',
  },
  messageContainer: {
    width: 260,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  successMessage: {
    backgroundColor: COLORS.lunesFunctionalCorrectDark,
  },
  failedMessage: {
    backgroundColor: COLORS.lunesFunctionalIncorrectDark,
  },
  textContainer: {
    marginLeft: 8,
  },
  text: {
    fontSize: 12,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
    color: COLORS.lunesBlack,
  },
  nextWordButton: {
    width: 160,
    height: 40,
    backgroundColor: COLORS.lunesBlack,
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextWordLabel: {
    textAlign: 'center',
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-Semibold',
    fontSize: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginRight: 8,
  },
});
