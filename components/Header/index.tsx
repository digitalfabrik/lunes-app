import {
  React,
  View,
  styles,
  SquareIcon,
  StarIcon,
  CircleIcon,
  LinesIcon,
  SmileIcon,
} from './imports';

const Header = ({top}: any) => {
  return (
    <View style={{...styles.wrapper, paddingTop: top}}>
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
        <View style={styles.smileIcon}>
          <SmileIcon />
        </View>
      </View>
    </View>
  );
};

export default Header;
