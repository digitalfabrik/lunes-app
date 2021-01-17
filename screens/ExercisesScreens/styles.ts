import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    paddingBottom: 0,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    color: COLORS.lunesGreyDark,
    fontFamily: 'SourceSansPro-SemiBold',
    marginBottom: 4,
  },
  description: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.lunesGreyMedium,
    fontFamily: 'SourceSansPro-Regular',
  },
});
