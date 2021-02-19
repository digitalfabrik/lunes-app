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
  CorrectIcon,
  Button,
  NextArrow,
} from './imports';

const CorrectResults = ({route, navigation}: IResultScreenProps) => {
  const {extraParams, title, description, Level} = route.params;
  const [correctEntries, setCorrectEntries] = React.useState<IDocumentProps[]>(
    [],
  );
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
      AsyncStorage.getItem('correct').then((value) => {
        setCorrectEntries(value && JSON.parse(value));
        setIsLoading(false);
      });
    }, []),
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
        {`${extraParams.correctAnswersCount} of ${extraParams.totalCount} Words`}
      </Text>
    </Title>
  );
  const Footer = () => {
    const goToAlmostCorrectEntries = () => {
      navigation.navigate(SCREENS.AlmostCorrectResults, {
        title,
        description,
        Level,
        extraParams,
      });
    };
    return (
      <Button onPress={goToAlmostCorrectEntries} style={styles.viewButton}>
        <Text style={styles.darkLabel}>View almost correct entries</Text>
        <NextArrow style={styles.arrow} />
      </Button>
    );
  };

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
          data={correctEntries}
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

export default CorrectResults;
