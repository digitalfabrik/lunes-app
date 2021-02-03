import {
  React,
  Header,
  FlatList,
  SCREENS,
  View,
  styles,
  Text,
  axios,
  useState,
  useFocusEffect,
  IProfessionsProps,
  ENDPOINTS,
  SafeAreaInsetsContext,
  Loading,
  MenuItem,
  IProfessionScreenProps,
} from './imports';

const ProfessionScreen = ({navigation}: IProfessionScreenProps) => {
  const [professions, setProfessions] = useState<IProfessionsProps[]>([]);
  const [selectedId, setSelectedId] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      axios.get(ENDPOINTS.professions.all).then((response) => {
        setProfessions(response.data);
        setIsLoading(false);
      });
      setSelectedId(-1);
    }, []),
  );

  const itemTextStyle = (item: any) =>
    item.id === selectedId ? styles.clickedItemDescription : styles.description;

  const title = (
    <Text style={styles.text}>
      Welcome to Lunes!{'\n'}
      Learn German vocabulary for your profession.
    </Text>
  );

  const Item = ({item}: any) => (
    <MenuItem
      selected={item.id === selectedId}
      title={item.title}
      icon={item.icon}
      onPress={() => handleNavigation(item)}>
      <Text style={itemTextStyle(item)}>
        {item.total_training_sets}
        {item.total_training_sets === 1 ? ' Bereich' : ' Bereiche'}
      </Text>
    </MenuItem>
  );

  const handleNavigation = (item: any) => {
    setSelectedId(item.id);
    navigation.navigate(SCREENS.professionSubcategory, {
      id: item.id,
      title: item.title,
      icon: item.icon,
    });
  };

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={styles.root}>
          <Header top={insets?.top} />
          <Loading isLoading={isLoading}>
            <FlatList
              data={professions}
              style={styles.list}
              ListHeaderComponent={title}
              ListHeaderComponentStyle={styles.title}
              renderItem={Item}
              keyExtractor={(item) => `${item.id}`}
              showsVerticalScrollIndicator={false}
            />
          </Loading>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
};

export default ProfessionScreen;
