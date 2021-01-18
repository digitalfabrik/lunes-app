import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    paddingBottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    backgroundColor: COLORS.lunesBlackUltralight,
  },
  image: {
    width: '100%',
    height: 210,
    position: 'relative',
  },
  volumeIcon: {
    position: 'absolute',
    top: 193,
    left: '45%',
  },
  container: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  textInputContainer: {
    width: 260,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: COLORS.lunesGreyMedium,
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 10,
    marginBottom: 40,
  },
  textInput: {
    height: 42,
    fontSize: 16,
    fontWeight: 'normal',
    letterSpacing: 0.11,
    fontFamily: 'SourceSansPro-Regular',
  },
  checkEntryButton: {
    width: 192,
    height: 40,
    backgroundColor: COLORS.lunesBlack,
    borderRadius: 20,
    marginBottom: 16,
    paddingVertical: 10,
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
    width: 192,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 29,
    borderWidth: 1.5,
    borderColor: COLORS.lunesBlack,
    paddingVertical: 10,
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
  headerText: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    color: COLORS.lunesGreyMedium,
  },
});
