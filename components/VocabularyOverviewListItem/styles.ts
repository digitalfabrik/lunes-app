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
    width: 52,
    height: 52,
    borderRadius: 50,
  },
  title: {
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 2,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-Regular',
  },
  description: {
    fontSize: 14,
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
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginBottom: 2,
  },
});
