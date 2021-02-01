import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  messageContainer: {
    width: wp('80%'),
    height: hp('9%'),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: -hp('3.5%'),
    marginBottom: hp('3%'),
  },
  successMessage: {
    backgroundColor: COLORS.lunesFunctionalCorrectDark,
  },
  failedMessage: {
    backgroundColor: COLORS.lunesFunctionalIncorrectDark,
  },
  textContainer: {
    marginHorizontal: 5,
    paddingRight: 15,
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
