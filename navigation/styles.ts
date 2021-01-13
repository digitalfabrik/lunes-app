import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.lunesWhite,
  },
  title: {
    color: COLORS.lunesBlack,
    marginLeft: -20,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  rightHeaderComponent: {
    paddingRight: 10,
  },
});
