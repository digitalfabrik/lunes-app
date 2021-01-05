import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: 600,
    paddingBottom: 50,
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.lunesGreyMedium,
  },
});
