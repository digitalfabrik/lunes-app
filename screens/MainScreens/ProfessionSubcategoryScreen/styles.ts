import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
  },
  itemText: {flexDirection: 'row', alignItems: 'center'},
  list: {
    paddingHorizontal: 15,
    flex: 1,
    width: wp('100%'),
  },
  description: {
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
  },
  clickedItemDescription: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    letterSpacing: undefined,
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-Regular',
  },
  badgeLabel: {
    color: COLORS.lunesWhite,
    fontFamily: 'SourceSansPro-Semibold',
    fontSize: 12,
    fontWeight: '600',
    minWidth: wp('6%'),
    height: wp('4%'),
    borderRadius: 8,
    backgroundColor: COLORS.lunesGreyMedium,
    overflow: 'hidden',
    textAlign: 'center',
  },
  clickedItemBadgeLabel: {
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Semibold',
    fontSize: 12,
    fontWeight: '600',
    minWidth: wp('6%'),
    height: wp('4%'),
    borderRadius: 8,
    backgroundColor: COLORS.lunesWhite,
    overflow: 'hidden',
    textAlign: 'center',
  },
});
