import {React, styles, View, Text, Pressable, Image, Arrow} from './imports';

const MenuItem = (props: any) => {
  const {selected, onPress, icon, title, children} = props;

  const itemStyle = selected ? styles.clickedContainer : styles.container;

  const itemTitleStyle = selected ? styles.clickedItemTitle : styles.itemTitle;

  return (
    <Pressable style={itemStyle} onPress={onPress}>
      <View style={styles.left}>
        <Image source={{uri: icon}} style={styles.icon} />

        <View>
          <Text style={itemTitleStyle}>{title}</Text>
          {children}
        </View>
      </View>

      <Arrow fill={selected ? 'red' : 'black'} />
    </Pressable>
  );
};

export default MenuItem;
