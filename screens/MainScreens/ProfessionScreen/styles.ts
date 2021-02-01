import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
  list: {
    paddingHorizontal: 15,
    flex: 1,
    width: wp('100%'),
  },
  title: {
    height: 54,
    alignItems: 'center',
    marginBottom: 32,
  },
  clickedItemDescription: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.white,
    fontFamily: 'SourceSansPro-Regular',
  },
  description: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
});
