import {
  React,
  Text,
  View,
  styles,
  IVocabularyOverviewScreen,
  TouchableOpacity,
  Home,
  useState,
  ENDPOINTS,
  IDocumentProps,
  useEffect,
  axios,
  FlatList,
  Title,
  VocabularyOverviewListItem,
  Loading,
  HomeButtonPressed,
} from './imports';

const VocabularyOverviewExerciseScreen = ({
  navigation,
  route,
}: IVocabularyOverviewScreen) => {
  const {trainingSetId} = route.params.extraParams;
  const [documents, setDocuments] = useState<IDocumentProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [isHomeButtonPressed, setIsHomeButtonPressed] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.popToTop()}
          onPressIn={() => setIsHomeButtonPressed(true)}
          onPressOut={() => setIsHomeButtonPressed(false)}
          activeOpacity={1}>
          {isHomeButtonPressed ? <HomeButtonPressed /> : <Home />}
        </TouchableOpacity>
      ),
    });
  }, [navigation, isHomeButtonPressed]);

  useEffect(() => {
    const url = ENDPOINTS.documents.all.replace(':id', `${trainingSetId}`);
    axios.get(url).then((response) => {
      setDocuments(response.data);
      setCount(response.data.length);
      setIsLoading(false);
    });
  }, [trainingSetId]);

  const Header = (
    <Title>
      <>
        <Text style={styles.screenTitle}>Vocabulary Overview</Text>
        <Text style={styles.description}>
          {count} {count === 1 ? 'Word' : 'Words'}
        </Text>
      </>
    </Title>
  );

  const Item = ({item}: any) => (
    <VocabularyOverviewListItem
      id={item.id}
      word={item.word}
      article={item.article}
      image={item.image}
      audio={item.audio}
    />
  );

  return (
    <View style={styles.root}>
      <Loading isLoading={isLoading}>
        <FlatList
          data={documents}
          style={styles.list}
          ListHeaderComponent={Header}
          renderItem={Item}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
        />
      </Loading>
    </View>
  );
};

export default VocabularyOverviewExerciseScreen;
