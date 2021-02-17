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
  Button,
  BUTTONS_THEME,
  SCREENS,
  RepeatIcon,
  TouchableOpacity,
  FinishIcon,
  StatusBar,
} from './imports';

const ResultsOverview = ({navigation, route}: IResultsOverviewScreenProps) => {
  const {extraParams, results} = route.params;
  const {Level, exercise, exerciseDescription} = route.params.extraParams;
  const [selectedId, setSelectedId] = React.useState(-1);
  const [counts, setCounts] = React.useState({});

  useFocusEffect(React.useCallback(() => setSelectedId(-1), []));

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.rightHeader}
          onPress={() => navigation.navigate(SCREENS.exercises)}>
          <Text style={styles.headerText}>Finish Exercise</Text>
          <FinishIcon />
        </TouchableOpacity>
      ),
    });

    setCounts({
      total: results.length,
      correct: results.filter((res) => res.result === 'correct').length,
      incorrect: results.filter((res) => res.result === 'incorrect').length,
      almostCorrect: results.filter((res) => res.result === 'similar').length,
    });
  }, [results, navigation]);

  const handleNavigation = (item: any) => {
    setSelectedId(item.id);

    navigation.navigate(item.nextScreen, {
      extraParams: {
        results,
        counts,
        ...extraParams,
      },
    });
  };

  const repeatExercise = () => {
    navigation.navigate(SCREENS.vocabularyTrainer, {
      retryData: {data: results},
      extraParams,
    });
  };

  const descriptionStyle = (item: any) =>
    item.id === selectedId ? styles.clickedItemDescription : styles.description;

  const itemStyle = (item: any) =>
    item.id === selectedId ? styles.clickedContainer : styles.container;

  const itemTitleStyle = (item: any) =>
    item.id === selectedId ? styles.clickedItemTitle : styles.title2;

  const titleCOMP = (
    <Title>
      <Text style={styles.screenTitle}>Results Overview</Text>
      <Text style={styles.screenSubTitle}>{exercise}</Text>
      <Text style={styles.screenDescription}>{exerciseDescription}</Text>
      <Level style={styles.level} />
    </Title>
  );

  const Item = ({item}: any) => {
    const count =
      item.id === 1
        ? counts.correct
        : item.id === 2
        ? counts.almostCorrect
        : counts.incorrect;

    const selected = item.id === selectedId;
    const iconColor = selected ? COLORS.lunesWhite : COLORS.lunesGreyDark;
    const arrowColor = selected ? COLORS.lunesRedLight : COLORS.lunesBlack;

    return (
      <Pressable style={itemStyle(item)} onPress={() => handleNavigation(item)}>
        <View style={styles.leftSide}>
          <item.icon fill={iconColor} stroke={iconColor} />
          <View style={styles.text}>
            <Text style={itemTitleStyle(item)}>{item.title}</Text>
            <Text style={descriptionStyle(item)}>
              {`${count} of ${counts.total} Words`}
            </Text>
          </View>
        </View>
        <Arrow fill={arrowColor} />
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={RESULTS}
        style={styles.list}
        ListHeaderComponent={titleCOMP}
        renderItem={Item}
        keyExtractor={(item) => `${item.id}`}
        showsVerticalScrollIndicator={false}
      />

      <Button onPress={repeatExercise} theme={BUTTONS_THEME.dark}>
        <RepeatIcon fill={COLORS.lunesWhite} />
        <Text style={styles.lightLabel}>Repeat whole exercise</Text>
      </Button>
    </View>
  );
};

export default ResultsOverview;
