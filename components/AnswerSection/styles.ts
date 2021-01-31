import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: hp('65%'),
  },
  textInputContainer: {
    width: wp('80%'),
    height: hp('8%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: COLORS.lunesGreyMedium,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 10,
    marginBottom: hp('6%'),
  },
  activeTextInput: {
    borderColor: COLORS.lunesBlack,
  },
  textInput: {
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 0.11,
    fontFamily: 'SourceSansPro-Regular',
  },
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
    display: 'flex',
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
