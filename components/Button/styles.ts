import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {COLORS} from '../../constants/colors';

const buttonBase: any = {
  flexDirection: 'row',
  paddingVertical: 10,
  width: wp('70%'),
  alignItems: 'center',
  borderRadius: hp('7%'),
  justifyContent: 'center',
  height: hp('7%'),
  marginBottom: hp('3%'),
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
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.lunesBlack,
  },
  disabledButton: {
    ...buttonBase,
    backgroundColor: COLORS.lunesBlackUltralight,
  },
});
