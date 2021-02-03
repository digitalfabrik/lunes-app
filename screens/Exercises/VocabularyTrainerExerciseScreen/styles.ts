import {StyleSheet} from 'react-native';
import {COLORS} from '../../../constants/colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    paddingBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    backgroundColor: COLORS.lunesBlackUltralight,
  },
  image: {
    width: '100%',
    height: hp('35%'),
    position: 'relative',
    resizeMode: 'cover',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    color: COLORS.lunesGreyMedium,
  },
  title: {
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
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
});
