import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    width: '100%',
    paddingBottom: 0,
    position: 'relative',
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
    marginBottom: 4,
    marginTop: 11,
  },
  description: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
  list: {
    paddingHorizontal: 15,
    flexGrow: 0,
    width: wp('100%'),
    marginBottom: hp('6%'),
  },
  listContent: {
    alignItems: 'center',
  },
  darkLabel: {
    textAlign: 'center',
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-Semibold',
    fontSize: wp('3.5%'),
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  arrow: {
    marginLeft: 5,
  },
  viewButton: {
    position: 'absolute',
    bottom: 0,
  },
});
