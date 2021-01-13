import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 17,
    paddingRight: 16,
    paddingLeft: 20,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 310,
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  item: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    display: 'flex',
  },
  image: {
    marginRight: 15,
    width: 52,
    height: 52,
    borderRadius: 50,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    letterSpacing: undefined,
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
  speaker: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: COLORS.lunesFunctionalIncorrectDark,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
