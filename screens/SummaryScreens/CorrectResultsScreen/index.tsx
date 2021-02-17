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
  CorrectIcon,
  Button,
  NextArrow,
} from './imports';

const CorrectResults = ({route, navigation}: IResultScreenProps) => {
  const {extraParams} = route.params;
  const {title, description, Level, results, counts} = extraParams;
  const [correctEntries, setCorrectEntries] = React.useState<IDocumentProps[]>(
    [],
  );
  const [isLoading, setIsLoading] = React.useState(true);

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
      setCorrectEntries(results.filter(({result}) => result === 'correct'));
      setIsLoading(false);
    }, [navigation, results]),
  );

  const titleComp = (
    <Title>
      <CorrectIcon
        fill={COLORS.lunesGreyDark}
        stroke={COLORS.lunesGreyDark}
        width={36}
        height={36}
      />
      <Text style={styles.screenTitle}>Correct Entries</Text>
      <Text style={styles.description}>
        {`${counts.correct} of ${counts.total} Words`}
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

  const goToAlmostCorrectEntries = () => {
    navigation.navigate(SCREENS.AlmostCorrectResults, {
      title,
      description,
      Level,
      extraParams,
    });
  };

  return (
    <View style={styles.root}>
      <Loading isLoading={isLoading}>
        <FlatList
          data={correctEntries}
          style={styles.list}
          ListHeaderComponent={titleComp}
          renderItem={Item}
          keyExtractor={(item) => `${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />

        <Button onPress={goToAlmostCorrectEntries} style={styles.viewButton}>
          <Text style={styles.darkLabel}>View almost correct entries</Text>
          <NextArrow style={styles.arrow} />
        </Button>
      </Loading>
    </View>
  );
};

export default CorrectResults;
