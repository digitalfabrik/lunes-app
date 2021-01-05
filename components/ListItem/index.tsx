import {
  React,
  styles,
  IListItemProps,
  Arrow,
  View,
  Text,
  useState,
  RedArrow,
} from './imports';

const ListItem = ({title, description, Icon}: IListItemProps) => {
  const [isItemClicked, setIsItemClicked] = useState(false);

  return (
    <View
      style={isItemClicked ? styles.clickedItem : styles.container}
      onTouchEnd={() => {
        setIsItemClicked(true);
        return true;
      }}>
      <View style={styles.item}>
        <View style={styles.icon}>
          <Icon width={24} height={24} />
        </View>
        <View style={styles.text}>
          <Text style={isItemClicked ? styles.clickedItemTitle : styles.title}>
            {title}
          </Text>
          <Text
            style={
              isItemClicked ? styles.clickedItemDescription : styles.description
            }>
            {description}
          </Text>
        </View>
      </View>
      <View style={styles.arrow}>
        {isItemClicked ? <RedArrow /> : <Arrow />}
      </View>
    </View>
  );
};

export default ListItem;
