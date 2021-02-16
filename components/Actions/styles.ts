import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  lightLabel: {
    textAlign: 'center',
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-Semibold',
    fontSize: wp('4%'),
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  darkLabel: {
    textAlign: 'center',
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-Semibold',
    fontSize: wp('4%'),
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  disabledButtonLabel: {
    color: COLORS.lunesBlackLight,
  },
  arrowLabel: {
    marginRight: 8,
  },
  arrow: {
    marginLeft: 5,
  },
});
