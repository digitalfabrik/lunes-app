import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  root: {
    backgroundColor: COLORS.lunesWhite,
    height: '100%',
    paddingBottom: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBar: {
    backgroundColor: COLORS.lunesBlackUltralight,
  },
  image: {
    width: '100%',
    height: 210,
    position: 'relative',
  },
  volumeIcon: {
    position: 'absolute',
    top: 193,
    left: '45%',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'normal',
    fontFamily: 'SourceSansPro-Regular',
    color: COLORS.lunesGreyMedium,
  },
});
