import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  checkEntryButton: {
    width: wp('55%'),
    height: hp('7%'),
    backgroundColor: COLORS.lunesBlack,
    borderRadius: 20,
    marginBottom: hp('3%'),
    paddingVertical: 10,
    display: 'flex',
    justifyContent: 'center',
  },
  checkEntryLabel: {
    textAlign: 'center',
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-Semibold',
    fontSize: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  giveUpButton: {
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
  giveUpLabel: {
    textAlign: 'center',
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-Semibold',
    fontSize: 14,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  tryLaterButton: {
    display: 'flex',
    flexDirection: 'row',
    width: 105,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: COLORS.lunesBlackUltralight,
  },
  disabledButtonLabel: {
    color: COLORS.lunesBlackLight,
  },
  nextWordButton: {
    width: wp('55%'),
    height: hp('7%'),
    backgroundColor: COLORS.lunesBlack,
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: hp('5%'),
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
