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
  IncorrectIcon,
  Button,
  NextArrow,
} from './imports';

const IncorrectResults = ({route, navigation}: IResultScreenProps) => {
  const {extraParams} = route.params;
  const [incorrectEntries, setIncorrectEntries] = React.useState<
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
      AsyncStorage.getItem('incorrect').then((value) => {
        setIncorrectEntries(value && JSON.parse(value));
        setIsLoading(false);
      });
    }, []),
  );

  const titleComp = (
    <Title>
      <IncorrectIcon
        fill={COLORS.lunesGreyDark}
        stroke={COLORS.lunesGreyDark}
        width={36}
        height={36}
      />
      <Text style={styles.screenTitle}>Incorrect Entries</Text>
      <Text style={styles.description}>
        {`${extraParams.incorrectAnswersCount} of ${extraParams.totalCount} Words`}
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

  const goToCorrectEntries = () => {
    navigation.navigate(SCREENS.CorrectResults, {
      extraParams,
    });
  };

  return (
    <View style={styles.root}>
      <Loading isLoading={isLoading}>
        <FlatList
          data={incorrectEntries}
          style={styles.list}
          ListHeaderComponent={titleComp}
          renderItem={Item}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        <Button onPress={goToCorrectEntries} style={styles.viewButton}>
          <Text style={styles.giveUpLabel}>View correct entries</Text>
          <NextArrow style={styles.arrow} />
        </Button>
      </Loading>
    </View>
  );
};

export default IncorrectResults;
