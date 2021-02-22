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
  IncorrectIcon,
  Button,
  NextArrow,
  RepeatIcon,
  BUTTONS_THEME,
} from './imports';

const IncorrectResults = ({route, navigation}: IResultScreenProps) => {
  const {extraParams} = route.params;
  const {title, description, Level, results, counts} = extraParams;
  const [incorrectEntries, setIncorrectEntries] = React.useState<
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

      setIncorrectEntries(results.filter(({result}) => result === 'incorrect'));
      setIsLoading(false);
    }, [navigation, results]),
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
        {`${counts.incorrect} of ${counts.total} Words`}
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
      title,
      description,
      Level,
      extraParams,
    });
  };

  const repeatIncorrectEntries = () =>
    navigation.navigate(SCREENS.vocabularyTrainer, {
      retryData: {data: incorrectEntries},
      extraParams,
    });

  const retryButton =
    incorrectEntries.length > 0 ? (
      <Button onPress={repeatIncorrectEntries} theme={BUTTONS_THEME.dark}>
        <RepeatIcon fill={COLORS.lunesWhite} />
        <Text style={styles.lightLabel}>Repeat incorrect entries</Text>
      </Button>
    ) : null;

  const Footer = (
    <>
      {retryButton}

      <Button onPress={goToCorrectEntries}>
        <Text style={styles.darkLabel}>View correct entries</Text>
        <NextArrow style={styles.arrow} />
      </Button>
    </>
  );

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
          ListFooterComponent={Footer}
          ListFooterComponentStyle={styles.footer}
        />
      </Loading>
    </View>
  );
};

export default IncorrectResults;
