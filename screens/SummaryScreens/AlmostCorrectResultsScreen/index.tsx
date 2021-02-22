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
  const {extraParams} = route.params;
  const {counts, results} = route.params.extraParams;
  const [almostCorrectEntries, setAlmostCorrectEntries] = React.useState<
    IDocumentProps[]
  >([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useLayoutEffect(() => {}, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.exercises)}>
            <CircularFinishIcon />
          </TouchableOpacity>
        ),
      });
      setAlmostCorrectEntries(
        results.filter(({result}) => result === 'similar'),
      );
      setIsLoading(false);
    }, [navigation, results]),
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
        {`${counts.almostCorrect} of ${counts.total} Words`}
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
    navigation.navigate(SCREENS.IncorrectResults, extraParams);
  };

  const repeatAlmostCorrectEntries = () =>
    navigation.navigate(SCREENS.vocabularyTrainer, {
      retryData: {data: almostCorrectEntries},
      extraParams,
    });

  const retryButton =
    almostCorrectEntries.length > 0 ? (
      <Button onPress={repeatAlmostCorrectEntries} theme={BUTTONS_THEME.dark}>
        <RepeatIcon fill={COLORS.lunesWhite} />
        <Text style={styles.lightLabel}>Repeat almost correct entries</Text>
      </Button>
    ) : null;

  const Footer = (
    <>
      {retryButton}
      <Button onPress={goToIncorrectEntries}>
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
          ListFooterComponentStyle={styles.footer}
        />
      </Loading>
    </View>
  );
};

export default AlmostCorrectResults;
