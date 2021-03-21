import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.lunesWhite,
    shadowOpacity: 0,
    elevation: 0,
    borderBottomColor: COLORS.lunesBlackUltralight,
    borderBottomWidth: 1,
  },
  title: {
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('4%'),
    textTransform: 'uppercase',
    fontWeight: '600',
    marginLeft: 15,
  },
  headerLeft: {
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
  },
  headerRight: {
    paddingRight: 10,
  },
  headerLeftTitle: {
    marginLeft: -15,
  },
});
