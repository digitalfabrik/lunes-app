import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lunesBlack,
    width: wp('80%'),
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderRadius: 2,
  },
  message: {
    color: COLORS.lunesWhite,
    fontSize: wp('3.5%'),
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    width: wp('60%'),
    marginLeft: 8,
  },
});
