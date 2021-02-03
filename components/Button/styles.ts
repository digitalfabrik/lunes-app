import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  darkButton: {
    width: wp('55%'),
    height: hp('7%'),
    backgroundColor: COLORS.lunesBlack,
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: hp('3%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lightButton: {
    width: wp('55%'),
    height: hp('7%'),
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: hp('3%'),
    borderWidth: 1.5,
    borderColor: COLORS.lunesBlack,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    width: 105,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.lunesBlackUltralight,
  },
});
