import {
  React,
  View,
  styles,
  SquareIcon,
  StarIcon,
  CircleIcon,
  LinesIcon,
} from './imports';

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.squareIcon}>
        <SquareIcon />
      </View>
      <View style={styles.starIcon}>
        <StarIcon />
      </View>
      <View style={styles.circleIcon}>
        <CircleIcon />
      </View>
      <View style={styles.verticalLinesIcon}>
        <LinesIcon />
      </View>
    </View>
  );
};

export default Header;
