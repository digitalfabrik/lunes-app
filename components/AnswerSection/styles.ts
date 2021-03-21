import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    height: hp('65%'),
  },
  textInputContainer: {
    width: wp('80%'),
    height: hp('8%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 15,
    marginBottom: hp('6%'),
  },
  textInput: {
    fontSize: wp('4.5%'),
    fontWeight: 'normal',
    letterSpacing: 0.11,
    fontFamily: 'SourceSansPro-Regular',
    color: COLORS.lunesBlack,
    width: wp('60%'),
  },
  volumeIcon: {
    position: 'absolute',
    top: -20,
    left: '45%',
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: COLORS.lunesFunctionalIncorrectDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
