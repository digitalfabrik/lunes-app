import {StyleSheet} from 'react-native';
import {COLORS} from '../ListView/imports';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
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
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    width: wp('60%'),
    marginLeft: 8,
  },
});
