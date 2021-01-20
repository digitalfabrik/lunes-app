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
  SCREENS,
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
  numOfCategories,
  numOfWords,
  from,
}: IListItemProps) => {
  const [isItemClicked, setIsItemClicked] = useState(false);

  const handleNavigation = () => {
    navigation.navigate(nextScreen, {
      id: id,
      title: title,
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
          <View style={styles.descriptionContainer}>
            {from == SCREENS.profession ? (
              <Text
                style={
                  isItemClicked
                    ? styles.clickedItemDescription
                    : styles.description
                }>
                {numOfCategories}{' '}
                {numOfCategories == 1 ? 'Bereich' : 'Bereiche'}
              </Text>
            ) : from == SCREENS.professionSubcategory ? (
              <>
                <View
                  style={
                    isItemClicked ? styles.clickedItemBadge : styles.badge
                  }>
                  <Text
                    style={
                      isItemClicked
                        ? styles.clickedItemBadgeLabel
                        : styles.badgeLabel
                    }>
                    {`${numOfWords}`}
                  </Text>
                </View>
                <Text
                  style={
                    isItemClicked
                      ? styles.clickedItemDescription
                      : styles.description
                  }>
                  {numOfWords == 1 ? 'Lektion' : 'Lektionen'}
                </Text>
              </>
            ) : (
              <Text
                style={
                  isItemClicked
                    ? styles.clickedItemDescription
                    : styles.description
                }>
                {description}
              </Text>
            )}
          </View>
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
