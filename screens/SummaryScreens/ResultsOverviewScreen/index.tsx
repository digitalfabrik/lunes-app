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
  RESULT_TYPE,
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
      correct: results.filter(({result}) => result === 'correct').length,
      incorrect: results.filter(({result}) => result === 'incorrect').length,
      similar: results.filter(({result}) => result === 'similar').length,
    });
  }, [results, navigation]);

  const Header = (
    <Title>
      <Text style={styles.screenTitle}>Results Overview</Text>
      <Text style={styles.screenSubTitle}>{exercise}</Text>
      <Text style={styles.screenDescription}>{exerciseDescription}</Text>
      <Level style={styles.level} />
    </Title>
  );

  const Item = ({item}: any) => {
    const handleNavigation = ({id}: number) => {
      setSelectedId(id);

      navigation.navigate(SCREENS.ResultScreen, {
        extraParams,
        resultType: RESULT_TYPE[id - 1],
        results,
        counts,
      });
    };

    const cID = RESULT_TYPE[item.id - 1];
    const count = counts[cID];

    const selected = item.id === selectedId;
    const iconColor = selected ? COLORS.lunesWhite : COLORS.lunesGreyDark;
    const arrowColor = selected ? COLORS.lunesRedLight : COLORS.lunesBlack;
    const itemStyle = selected ? styles.clickedContainer : styles.container;
    const itemTitleStyle = selected ? styles.clickedItemTitle : styles.title2;
    const descriptionStyle = selected
      ? styles.clickedItemDescription
      : styles.description;

    return (
      <Pressable style={itemStyle} onPress={() => handleNavigation(item)}>
        <View style={styles.leftSide}>
          <item.icon fill={iconColor} stroke={iconColor} />
          <View style={styles.text}>
            <Text style={itemTitleStyle}>{item.title}</Text>
            <Text style={descriptionStyle}>
              {`${count} of ${counts.total} Words`}
            </Text>
          </View>
        </View>
        <Arrow fill={arrowColor} />
      </Pressable>
    );
  };

  const repeatExercise = () => {
    navigation.navigate(SCREENS.vocabularyTrainer, {
      retryData: {data: results},
      extraParams,
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />

      <FlatList
        data={RESULTS}
        style={styles.list}
        ListHeaderComponent={Header}
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
