import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  messageContainer: {
    width: wp('80%'),
    height: hp('9%'),
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -hp('4%'),
    marginBottom: hp('3%'),
  },
  imageBackground: {
    width: wp('80%'),
    height: hp('9%'),
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textContainer: {
    marginHorizontal: 5,
    paddingRight: 15,
    paddingLeft: 5,
  },
  text: {
    fontSize: wp('3.5%'),
    fontFamily: 'SourceSansPro-Regular',
    fontWeight: 'normal',
    color: COLORS.lunesBlack,
  },
});
