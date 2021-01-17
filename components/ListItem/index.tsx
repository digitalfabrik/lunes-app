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
  Image,
} from './imports';

const ListItem = ({
  id,
  title,
  description,
  icon,
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
      icon: icon,
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
        {icon && <Image source={{uri: icon}} style={styles.icon} />}
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
