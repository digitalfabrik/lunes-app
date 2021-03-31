import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
  },
  text: {
    marginTop: 56,
    textAlign: 'center',
    fontSize: wp('4%'),
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
  list: {
    width: '100%',
  },
  title: {
    marginBottom: 32,
  },
  clickedItemDescription: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    color: COLORS.white,
    fontFamily: 'SourceSansPro-Regular',
  },
  description: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
});
