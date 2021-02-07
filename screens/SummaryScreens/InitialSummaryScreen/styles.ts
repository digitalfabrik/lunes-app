import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    alignItems: 'center',
  },
  upperSection: {
    width: '100%',
    height: hp('60%'),
    backgroundColor: COLORS.lunesBlack,
    borderBottomLeftRadius: 160,
    borderBottomRightRadius: 160,
    marginBottom: hp('8%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    width: wp('60%'),
    marginTop: hp('5%'),
  },
  message: {
    color: COLORS.lunesWhite,
    fontSize: 20,
    fontFamily: 'SourceSansPro-Semibold',
    fontWeight: '600',
    textAlign: 'center',
  },
  checkResultsButtonLabel: {
    fontSize: 14,
    fontFamily: 'SourceSansPro-Semibold',
    color: COLORS.lunesWhite,
    fontWeight: '600',
    marginLeft: 10,
    textTransform: 'uppercase',
  },
  repeatButtonLabel: {
    fontSize: 14,
    fontFamily: 'SourceSansPro-Semibold',
    color: COLORS.lunesBlack,
    fontWeight: '600',
    marginLeft: 10,
    textTransform: 'uppercase',
  },
});
