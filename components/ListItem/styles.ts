import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 17,
    paddingRight: 16,
    paddingLeft: 25,
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
  icon: {
    marginRight: 10,
    width: 24,
    height: 24,
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
  arrow: {
    width: 24,
    height: 24,
  },
  clickedItem: {
    paddingVertical: 17,
    paddingRight: 16,
    paddingLeft: 25,
    marginBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 310,
    backgroundColor: COLORS.lunesBlack,
    borderColor: COLORS.white,
  },
  clickedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.white,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  clickedItemDescription: {
    fontSize: 14,
    fontWeight: 'normal',
    letterSpacing: undefined,
    color: COLORS.white,
    fontFamily: 'SourceSansPro-Regular',
  },
  level: {
    marginTop: 11,
  },
});
