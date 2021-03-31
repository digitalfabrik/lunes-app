import {
  React,
  Header,
  FlatList,
  SCREENS,
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
  AsyncStorage,
} from './imports';

import {View} from 'react-native';

const ProfessionScreen = ({navigation}: IProfessionScreenProps) => {
  const [professions, setProfessions] = useState<IProfessionsProps[]>([]);
  const [selectedId, setSelectedId] = useState(-1);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('session').then(async (value) => {
        if (value) {
          navigation.navigate(SCREENS.vocabularyTrainer, JSON.parse(value));
        }
      });

      axios.get(ENDPOINTS.professions.all).then((response) => {
        setProfessions(response.data);
        setIsLoading(false);
      });
      setSelectedId(-1);
    }, [navigation]),
  );

  const title = (top) => (
    <>
      <Header top={top} />

      <Text style={styles.text}>
        Welcome to Lunes!{'\n'}
        Learn German vocabulary for your profession.
      </Text>
    </>
  );

  const Item = ({item}: any) => {
    const itemTextStyle =
      item.id === selectedId
        ? styles.clickedItemDescription
        : styles.description;

    return (
      <MenuItem
        selected={item.id === selectedId}
        title={item.title}
        icon={item.icon}
        onPress={() => handleNavigation(item)}>
        <Text style={itemTextStyle}>
          {item.total_training_sets}
          {item.total_training_sets === 1 ? ' Bereich' : ' Bereiche'}
        </Text>
      </MenuItem>
    );
  };

  const handleNavigation = (item: any) => {
    setSelectedId(item.id);
    navigation.navigate(SCREENS.professionSubcategory, {
      extraParams: {
        disciplineID: item.id,
        disciplineTitle: item.title,
        disciplineIcon: item.icon,
      },
    });
  };

  return (
    <SafeAreaInsetsContext.Consumer>
      {(insets) => (
        <View style={styles.root}>
          <Loading isLoading={isLoading}>
            <FlatList
              data={professions}
              style={styles.list}
              ListHeaderComponent={title(insets?.top)}
              ListHeaderComponentStyle={styles.title}
              renderItem={Item}
              keyExtractor={(item) => `${item.id}`}
              scrollEnabled={true}
            />
          </Loading>
        </View>
      )}
    </SafeAreaInsetsContext.Consumer>
  );
};

export default ProfessionScreen;
