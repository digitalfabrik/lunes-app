import Loading from '../../../components/Loading';
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
} from './imports';

const VocabularyOverviewExerciseScreen = ({
  navigation,
  route,
}: IVocabularyOverviewScreen) => {
  const {extraParams} = route.params;
  const [documents, setDocuments] = useState<IDocumentProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <Home />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const url = ENDPOINTS.documents.all.replace(':id', `${extraParams}`);
    axios.get(url).then((response) => {
      setDocuments(response.data);
      setCount(response.data.length);
      setIsLoading(false);
    });
  }, [extraParams]);

  const titleComp = (
    <Title>
      <Text style={styles.screenTitle}>Vocabulary Overview</Text>
      <Text style={styles.description}>
        {count} {count === 1 ? 'Word' : 'Words'}
      </Text>
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
          ListHeaderComponent={titleComp}
          renderItem={Item}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </Loading>
    </View>
  );
};

export default VocabularyOverviewExerciseScreen;
