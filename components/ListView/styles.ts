import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  root: {
    marginTop: 40,
    paddingTop: 16,
    height: '100%',
    paddingHorizontal: 15,
  },
  content: {
    alignItems: 'center',
  },
  welcome: {
    width: 228,
    height: 54,
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 14,
    color: COLORS.lunesGreyMedium,
  },
});
