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
} from './imports';

const IncorrectResults = ({route, navigation}: IResultScreenProps) => {
  const {title, extraParams, Icon} = route.params;
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
      <Icon
        fill={COLORS.lunesGreyDark}
        stroke={COLORS.lunesGreyDark}
        width={36}
        height={36}
      />
      <Text style={styles.screenTitle}>{title}</Text>
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
      </Loading>
    </View>
  );
};

export default IncorrectResults;
