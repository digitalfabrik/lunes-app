import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: 'center',
  },
  messageContainer: {
    width: 260,
    minHeight: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  successMessage: {
    backgroundColor: COLORS.lunesFunctionalCorrectDark,
  },
  failedMessage: {
    backgroundColor: COLORS.lunesFunctionalIncorrectDark,
  },
  textContainer: {
    marginHorizontal: 8,
    paddingRight: 4,
  },
  text: {
    fontSize: 12,
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
    color: COLORS.lunesBlack,
  },
  almostCorrectMessage: {
    backgroundColor: COLORS.lunesFunctionalAlmostCorrectDark,
  },
});
