import {StyleSheet} from 'react-native';
import {COLORS} from '../ListView/imports';

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lunesBlack,
    width: 260,
    height: 60,
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderRadius: 2,
  },
  message: {
    color: COLORS.lunesWhite,
    fontSize: 12,
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    width: 200,
    marginLeft: 8,
  },
});
