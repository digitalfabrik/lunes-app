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
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
  },
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    letterSpacing: undefined,
    color: COLORS.lunesGreyMedium,
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
  },
  clickedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.11,
    marginBottom: 2,
    color: COLORS.white,
  },
  clickedItemDescription: {
    fontSize: 14,
    fontWeight: 'normal',
    letterSpacing: undefined,
    color: COLORS.white,
  },
});
