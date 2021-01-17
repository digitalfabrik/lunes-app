import {
  React,
  styles,
  IListItemProps,
  Arrow,
  View,
  Text,
  useState,
  RedArrow,
  useFocusEffect,
  Pressable,
} from './imports';

const ListItem = ({
  id,
  title,
  description,
  Icon,
  navigation,
  nextScreen,
  extraParams,
  Level,
}: IListItemProps) => {
  const [isItemClicked, setIsItemClicked] = useState(false);

  const handleNavigation = () => {
    navigation.navigate(nextScreen, {
      id: id,
      title: title,
      description: description,
      Icon: Icon,
      extraParams,
    });
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsItemClicked(false);
    }, []),
  );

  return (
    <Pressable
      style={isItemClicked ? styles.clickedItem : styles.container}
      onPress={() => {
        setIsItemClicked(true);
        handleNavigation();
        return true;
      }}>
      <View style={styles.item}>
        {Icon && (
          <View style={styles.icon}>
            <Icon width={24} height={24} />
          </View>
        )}
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
          {Level && <Level style={styles.level} />}
        </View>
      </View>
      <View style={styles.arrow}>
        {isItemClicked ? <RedArrow /> : <Arrow />}
      </View>
    </Pressable>
  );
};

export default ListItem;
