import {
  React,
  View,
  Text,
  styles,
  useFocusEffect,
  SCREENS,
  TouchableOpacity,
  Title,
  FlatList,
  Loading,
  VocabularyOverviewListItem,
  COLORS,
  Button,
  CircularFinishIcon,
  RESULT_PRESETS,
  NextArrow,
  RepeatIcon,
  BUTTONS_THEME,
  IDocumentProps,
  IResultScreenProps,
} from './imports';

const ResultScreen = ({route, navigation}: IResultScreenProps) => {
  const {extraParams, results, counts, resultType} = route.params;
  const [entries, setEntries] = React.useState<IDocumentProps[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const {next, Icon, title} = RESULT_PRESETS[resultType];

  useFocusEffect(
    React.useCallback(() => {
      setEntries(results.filter(({result}: any) => result === resultType));
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(SCREENS.exercises, {extraParams: extraParams})
            }>
            <CircularFinishIcon />
          </TouchableOpacity>
        ),
      });

      setIsLoading(false);
    }, [extraParams, navigation, resultType, results]),
  );

  const Header = (
    <Title>
      <>
        <Icon
          fill={COLORS.lunesGreyDark}
          stroke={COLORS.lunesGreyDark}
          width={36}
          height={36}
        />
        <Text style={styles.screenTitle}> {title} Entries</Text>
        <Text style={styles.description}>
          {`${counts[resultType]} of ${counts.total} Words`}
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

  const repeatIncorrectEntries = () =>
    navigation.navigate(SCREENS.vocabularyTrainer, {
      retryData: {data: entries},
      extraParams,
    });

  const retryButton =
    entries.length > 0 && ['similar', 'incorrect'].includes(resultType) ? (
      <Button onPress={repeatIncorrectEntries} theme={BUTTONS_THEME.dark}>
        <>
          <RepeatIcon fill={COLORS.lunesWhite} />
          <Text style={styles.lightLabel}>Repeat {resultType} entries</Text>
        </>
      </Button>
    ) : null;

  const Footer = (
    <>
      {retryButton}

      <Button
        onPress={() =>
          navigation.navigate(SCREENS.ResultScreen, {
            ...route.params,
            resultType: next.type,
          })
        }>
        <>
          <Text style={styles.darkLabel}>View {next.title} entries</Text>
          <NextArrow style={styles.arrow} />
        </>
      </Button>
    </>
  );

  return (
    <View style={styles.root}>
      <Loading isLoading={isLoading}>
        <FlatList
          data={entries}
          style={styles.list}
          ListHeaderComponent={Header}
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

export default ResultScreen;
