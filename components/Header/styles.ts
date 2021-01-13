import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.lunesBlack,
    height: 91,
    width: '100%',
    position: 'relative',
  },
  squareIcon: {
    position: 'absolute',
    top: 41.5,
    left: 24.3,
    width: 28,
    height: 28,
  },
  starIcon: {
    position: 'absolute',
    top: -5,
    left: 98.3,
    width: 28,
    height: 23.5,
  },
  circleIcon: {
    position: 'absolute',
    top: 37.5,
    right: 68.8,
    width: 28,
    height: 29,
  },
  verticalLinesIcon: {
    position: 'absolute',
    top: 16.5,
    right: 0,
    width: 24.5,
    height: 28,
  },
  smileIcon: {
    position: 'absolute',
    width: 80,
    height: 80,
    left: '50%',
    marginLeft: -40,
    top: 51,
  },
});
