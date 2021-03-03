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
  const {extraParams} = route.params;

  const {disciplineID, disciplineTitle, disciplineIcon} = extraParams;
  const [subcategories, setsubcategories] = useState<
    IProfessionSubcategoryProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(-1);
  const [count, setCount] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      const url = ENDPOINTS.subCategories.all.replace(':id', disciplineID);
      axios.get(url).then((response) => {
        setsubcategories(
          getProfessionSubcategoryWithIcon(disciplineIcon, response.data),
        );

        setCount(response.data.length);
        setIsLoading(false);
      });
      setSelectedId(-1);
    }, [disciplineIcon, disciplineID]),
  );

  const titleCOMP = (
    <Title>
      <>
        <Text style={styles.screenTitle}>{disciplineTitle}</Text>
        <Text style={styles.description}>
          {count} {count === 1 ? 'Kategory' : 'Kategories'}
        </Text>
      </>
    </Title>
  );

  const Item = ({item}: any) => {
    const selected = item.id === selectedId;
    const descriptionStyle = selected
      ? styles.clickedItemDescription
      : styles.description;

    const badgeStyle = selected
      ? styles.clickedItemBadgeLabel
      : styles.badgeLabel;

    return (
      <MenuItem
        selected={item.id === selectedId}
        title={item.title}
        icon={item.icon}
        onPress={() => handleNavigation(item)}>
        <View style={styles.itemText}>
          <Text style={badgeStyle}>{item.total_documents}</Text>
          <Text style={descriptionStyle}>
            {item.total_documents === 1 ? ' Lektion' : ' Lektionen'}
          </Text>
        </View>
      </MenuItem>
    );
  };

  const handleNavigation = (item: any) => {
    setSelectedId(item.id);
    // TODO: Can't place route params in extraParams
    navigation.navigate(SCREENS.exercises, {
      extraParams: {
        ...extraParams,
        trainingSetId: item.id,
        trainingSet: item.title,
      },
    });
  };
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
