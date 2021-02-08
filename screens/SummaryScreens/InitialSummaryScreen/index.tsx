import {
  React,
  View,
  Text,
  styles,
  Button,
  CheckIcon,
  ListIcon,
  RepeatIcon,
  BUTTONS_THEME,
  IInitialSummaryScreenProps,
  SCREENS,
  COLORS,
  useFocusEffect,
  AsyncStorage,
  StatusBar,
} from './imports';

const InitialSummaryScreen = ({
  navigation,
  route,
}: IInitialSummaryScreenProps) => {
  const {description, title, Level, totalCount} = route.params;
  const [correctAnswersCount, setCorrectAnswersCount] = React.useState(0);
  const [message, setMessage] = React.useState('');

  const checkResults = () => {
    navigation.navigate(SCREENS.ResultsOverview, {
      title,
      description,
      Level,
      totalCount,
    });
  };

  const repeatExercise = () => {
    navigation.navigate(SCREENS.vocabularyTrainer);
  };

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem('correct').then((value) =>
        setCorrectAnswersCount((value && JSON.parse(value)).length),
      );
    }, []),
  );

  React.useEffect(() => {
    setMessage(
      correctAnswersCount <= 0.35 * totalCount
        ? 'You still have some trouble with the basics,\nplease retry! '
        : correctAnswersCount > 0.35 * totalCount &&
          correctAnswersCount <= 0.75 * totalCount
        ? "You're getting there.\nPlease retry! "
        : 'Keep it up!\nYou have mastered the exercise very well.',
    );
  }, [correctAnswersCount, totalCount]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" />

      <View style={styles.upperSection}>
        <CheckIcon />
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
      <Button theme={BUTTONS_THEME.dark} onPress={checkResults}>
        <ListIcon />
        <Text style={styles.checkResultsButtonLabel}>Check my results</Text>
      </Button>
      <Button theme={BUTTONS_THEME.light} onPress={repeatExercise}>
        <RepeatIcon fill={COLORS.lunesBlack} />
        <Text style={styles.repeatButtonLabel}>Repeat exercise</Text>
      </Button>
    </View>
  );
};

export default InitialSummaryScreen;
