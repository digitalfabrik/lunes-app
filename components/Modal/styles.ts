import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    marginTop: 0,
    backgroundColor: COLORS.lunesOverlay,
  },
  modal: {
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('85%'),
    borderRadius: 4,
    position: 'relative',
    paddingVertical: 31,
  },
  closeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
  },
  message: {
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
    width: wp('60%'),
    marginBottom: 31,
    paddingTop: 31,
  },
  lightLabel: {
    color: COLORS.lunesWhite,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'SourceSansPro-SemiBold',
    letterSpacing: 0.4,
  },
  darkLabel: {
    color: COLORS.lunesBlack,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontFamily: 'SourceSansPro-SemiBold',
    letterSpacing: 0.4,
  },
});
