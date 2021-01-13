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
} from './imports';

const ListItem = ({
  id,
  title,
  description,
  Icon,
  navigation,
  nextScreen,
  extraParams,
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
    <View
      style={isItemClicked ? styles.clickedItem : styles.container}
      onTouchEnd={() => {
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
        </View>
      </View>
      <View style={styles.arrow}>
        {isItemClicked ? <RedArrow /> : <Arrow />}
      </View>
    </View>
  );
};

export default ListItem;
