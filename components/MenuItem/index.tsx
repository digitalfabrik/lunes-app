import {
  React,
  styles,
  View,
  Text,
  Pressable,
  Image,
  Arrow,
  COLORS,
  IMenuItemProps,
} from './imports';

const MenuItem = ({
  selected,
  onPress,
  icon,
  title,
  children,
}: IMenuItemProps) => {
  const itemStyle = selected ? styles.clickedContainer : styles.container;
  const itemTitleStyle = selected ? styles.clickedItemTitle : styles.itemTitle;

  return (
    <Pressable style={itemStyle} onPress={onPress}>
      <View style={styles.left}>
        <Image source={{uri: icon}} style={styles.icon} />

        <View>
          <Text style={itemTitleStyle} testID="title">
            {title}
          </Text>
          {children}
        </View>
      </View>

      <Arrow
        fill={selected ? COLORS.lunesRedLight : COLORS.lunesBlack}
        testID="arrow"
      />
    </Pressable>
  );
};

export default MenuItem;
