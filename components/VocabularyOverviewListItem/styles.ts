import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 17,
    paddingRight: 16,
    paddingLeft: 20,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('85%'),
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    marginRight: 15,
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: 50,
  },
  title: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    minWidth: wp('6%'),
    borderRadius: wp('3%'),
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-Regular',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    overflow: 'hidden',
    paddingVertical: 2,
  },
  description: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
    marginLeft: 5,
  },
  speaker: {
    width: 32,
    height: 32,
    borderRadius: 50,
    backgroundColor: COLORS.lunesFunctionalIncorrectDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
