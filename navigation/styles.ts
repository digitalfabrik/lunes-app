import {StyleSheet} from 'react-native';
import {COLORS} from '../constants/colors';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.lunesWhite,
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
  headerRight: {
    paddingRight: 10,
  },
  headerLeftTitle: {
    marginLeft: -15,
  },
});
