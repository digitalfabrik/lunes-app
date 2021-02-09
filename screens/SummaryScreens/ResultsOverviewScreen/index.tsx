import {
  React,
  View,
  Text,
  styles,
  Title,
  Pressable,
  Arrow,
  COLORS,
  IResultsOverviewScreenProps,
  RESULTS,
  FlatList,
  useFocusEffect,
  AsyncStorage,
  Button,
  BUTTONS_THEME,
  SCREENS,
  RepeatIcon,
  TouchableOpacity,
  FinishIcon,
  StatusBar,
} from './imports';

const ResultsOverview = ({navigation, route}: IResultsOverviewScreenProps) => {
  const {title, description, Level, totalCount} = route.params;
  const [selectedId, setSelectedId] = React.useState(-1);
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState(0);
  const [incorrectAnswersCount, setIncorrectAnswersCount] = React.useState(0);
  const [
    almostCorrectAnswersCount,
    setAlmostCorrectAnswersCount,
  ] = React.useState(0);

  const descriptionStyle = (item: any) =>
    item.id === selectedId ? styles.clickedItemDescription : styles.description;

  const itemStyle = (item: any) =>
    item.id === selectedId ? styles.clickedContainer : styles.container;

  const itemTitleStyle = (item: any) =>
    item.id === selectedId ? styles.clickedItemTitle : styles.title2;

  const titleCOMP = (
    <Title>
      <Text style={styles.screenTitle}>Results Overview</Text>
      <Text style={styles.screenSubTitle}>{title}</Text>
      <Text style={styles.screenDescription}>{description}</Text>
      <Level style={styles.level} />
    </Title>
  );

  const handleNavigation = (item: any) => {
    setSelectedId(item.id);

    navigation.navigate(item.nextScreen, {
      id: item.id,
      title: item.title,
      icon: item.icon,
      extraParams: {
        totalCount,
        correctAnswersCount,
        incorrectAnswersCount,
        almostCorrectAnswersCount,
      },
    });
  };

  const repeatExercise = () => {
    navigation.navigate(SCREENS.vocabularyTrainer);
  };

  const Item = ({item}: any) => {
    const count =
      item.id === 1
        ? correctAnswersCount
        : item.id === 2
        ? almostCorrectAnswersCount
        : incorrectAnswersCount;

    return (
      <Pressable style={itemStyle(item)} onPress={() => handleNavigation(item)}>
        <View style={styles.leftSide}>
          <item.icon
            fill={
              item.id === selectedId ? COLORS.lunesWhite : COLORS.lunesGreyDark
            }
            stroke={
              item.id === selectedId ? COLORS.lunesWhite : COLORS.lunesGreyDark
            }
          />
          <View style={styles.text}>
            <Text style={itemTitleStyle(item)}>{item.title}</Text>
            <Text
              style={descriptionStyle(
                item,
              )}>{`${count} von ${totalCount} words`}</Text>
          </View>
        </View>
        <Arrow
          fill={
            item.id === selectedId ? COLORS.lunesRedLight : COLORS.lunesBlack
          }
        />
      </Pressable>
    );
  };

  useFocusEffect(() => {
    AsyncStorage.getItem('correct').then((value) =>
      setCorrectAnswersCount(value && JSON.parse(value).length),
    );
    AsyncStorage.getItem('incorrect').then((value) =>
      setIncorrectAnswersCount(value && JSON.parse(value).length),
    );
    AsyncStorage.getItem('almost correct').then((value) =>
      setAlmostCorrectAnswersCount(value && JSON.parse(value).length),
    );
  });

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.rightHeader}
          onPress={() => navigation.navigate(SCREENS.exercises)}>
          <Text style={styles.headerText}>Finish Excercise</Text>
          <FinishIcon />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={RESULTS}
        style={styles.list}
        ListHeaderComponent={titleCOMP}
        ListHeaderComponentStyle={styles.listTitle}
        renderItem={Item}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
      />
      <Button onPress={repeatExercise} theme={BUTTONS_THEME.dark}>
        <RepeatIcon fill={COLORS.lunesWhite} />
        <Text style={styles.repeatButtonLabel}>Repeate whole exercise</Text>
      </Button>
    </View>
  );
};

export default ResultsOverview;
