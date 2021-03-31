import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
  },
  container: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: COLORS.white,
    borderColor: COLORS.lunesBlackUltralight,
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 2,
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
    fontSize: wp('3.5%'),
    fontWeight: 'normal',
    borderRadius: 10,
    marginBottom: 6,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-Regular',
    alignSelf: 'flex-start',
    width: wp('10%'),
    overflow: 'hidden',
    height: wp('5%'),
    textAlign: 'center',
    lineHeight: 18,
  },
  description: {
    fontSize: wp('4%'),
    fontWeight: 'normal',
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
    marginLeft: 8,
  },
  speaker: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 5},
    shadowRadius: 3,
    shadowOpacity: 10,
  },
});
