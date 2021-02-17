import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    width: '100%',
    paddingBottom: 0,
  },
  screenTitle: {
    textAlign: 'center',
    fontSize: wp('5%'),
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
    marginBottom: 4,
  },
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
  listContent: {
    alignItems: 'center',
  },
});
