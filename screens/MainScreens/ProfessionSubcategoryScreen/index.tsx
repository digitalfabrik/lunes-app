import {
  React,
  styles,
  View,
  Text,
  IProfessionSubcategoryScreenProps,
  LogBox,
  MenuItem,
  FlatList,
  SCREENS,
  ENDPOINTS,
  axios,
  IProfessionSubcategoryProps,
  useState,
  useFocusEffect,
  getProfessionSubcategoryWithIcon,
  StatusBar,
  Loading,
  Title,
} from './imports';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ProfessionSubcategoryScreen = ({
  route,
  navigation,
}: IProfessionSubcategoryScreenProps) => {
  const {id, title, icon} = route.params;
  const [subcategories, setsubcategories] = useState<
    IProfessionSubcategoryProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(-1);
  const [count, setCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const url = ENDPOINTS.subCategories.all.replace(':id', id);
      axios.get(url).then((response) => {
        setsubcategories(getProfessionSubcategoryWithIcon(icon, response.data));

        setCount(response.data.length);
        setIsLoading(false);
      });
      setSelectedId(-1);
    }, [icon, id]),
  );

  const descriptionStyle = (item: any) =>
    item.id === selectedId ? styles.clickedItemDescription : styles.description;

  const badgeStyle = (item: any) =>
    item.id === selectedId ? styles.clickedItemBadgeLabel : styles.badgeLabel;

  const titleCOMP = (
    <Title>
      <Text style={styles.screenTitle}>{title}</Text>
      <Text style={styles.description}>
        {count} {count === 1 ? 'Kategory' : 'Kategories'}
      </Text>
    </Title>
  );

  const handleNavigation = (item: any) => {
    setSelectedId(item.id);
    navigation.navigate(SCREENS.exercises, {
      subCategoryID: item.id,
      subCategory: item.title,
      profession: title,
      professionID: id,
    });
  };

  const Item = ({item}: any) => (
    <MenuItem
      selected={item.id === selectedId}
      title={item.title}
      icon={item.icon}
      onPress={() => handleNavigation(item)}>
      <View style={styles.itemText}>
        <Text style={badgeStyle(item)}>{item.total_documents}</Text>
        <Text style={descriptionStyle(item)}>
          {item.total_documents === 1 ? ' Lektion' : ' Lektionen'}
        </Text>
      </View>
    </MenuItem>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="blue" barStyle="dark-content" />
      <Loading isLoading={isLoading}>
        <FlatList
          data={subcategories}
          style={styles.list}
          ListHeaderComponent={titleCOMP}
          renderItem={Item}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
    </View>
  );
};

export default ProfessionSubcategoryScreen;
