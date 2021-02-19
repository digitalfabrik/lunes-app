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
  RepeatIcon,
  BUTTONS_THEME,
} from './imports';

const AlmostCorrectResults = ({route, navigation}: IResultScreenProps) => {
  const {extraParams, title, description, Level} = route.params;
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
      title,
      description,
      Level,
      extraParams,
    });
  };

  const repeatAlmostCorrectEntries = () =>
    navigation.navigate(SCREENS.vocabularyTrainer, {
      retryData: {data: almostCorrectEntries},
      extraParams: {
        ...extraParams,
        title,
        description,
        Level,
      },
    });

  const retryButton =
    extraParams.almostCorrectAnswersCount !== 0 ? (
      <Button
        onPress={repeatAlmostCorrectEntries}
        theme={BUTTONS_THEME.dark}
        style={styles.fixedPositionButton}>
        <RepeatIcon fill={COLORS.lunesWhite} />
        <Text style={styles.lightLabel}>Repeate almost correct entries</Text>
      </Button>
    ) : null;

  const Footer = (
    <>
      {retryButton}
      <Button onPress={goToIncorrectEntries} style={styles.viewButton}>
        <Text style={styles.darkLabel}>View incorrect entries</Text>
        <NextArrow style={styles.arrow} />
      </Button>
    </>
  );

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
          ListFooterComponent={Footer}
        />
      </Loading>
    </View>
  );
};

export default AlmostCorrectResults;
