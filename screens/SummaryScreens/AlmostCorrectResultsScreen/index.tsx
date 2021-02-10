import {
  React,
  Text,
  IResultScreenProps,
  CircularFinishIcon,
  SCREENS,
  TouchableOpacity,
  View,
  styles,
  Title,
  FlatList,
  useFocusEffect,
  AsyncStorage,
  Loading,
  VocabularyOverviewListItem,
  IDocumentProps,
  COLORS,
  AlmostCorrectIcon,
  Button,
  NextArrow,
} from './imports';

const AlmostCorrectResults = ({route, navigation}: IResultScreenProps) => {
  const {extraParams} = route.params;
  const [almostCorrectEntries, setAlmostCorrectEntries] = React.useState<
    IDocumentProps[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.exercises)}>
          <CircularFinishIcon />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('almost correct').then((value) => {
        setAlmostCorrectEntries(value && JSON.parse(value));
        setIsLoading(false);
      });
    }, []),
  );

  const titleComp = (
    <Title>
      <AlmostCorrectIcon
        fill={COLORS.lunesGreyDark}
        stroke={COLORS.lunesGreyDark}
        width={36}
        height={36}
      />
      <Text style={styles.screenTitle}>Almost correct Entries</Text>
      <Text style={styles.description}>
        {`${extraParams.almostCorrectAnswersCount} of ${extraParams.totalCount} Words`}
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

  const goToIncorrectEntries = () => {
    navigation.navigate(SCREENS.IncorrectResults, {
      extraParams,
    });
  };

  return (
    <View style={styles.root}>
      <Loading isLoading={isLoading}>
        <FlatList
          data={almostCorrectEntries}
          style={styles.list}
          ListHeaderComponent={titleComp}
          renderItem={Item}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        <Button onPress={goToIncorrectEntries} style={styles.viewButton}>
          <Text style={styles.giveUpLabel}>View incorrect entries</Text>
          <NextArrow style={styles.arrow} />
        </Button>
      </Loading>
    </View>
  );
};

export default AlmostCorrectResults;
