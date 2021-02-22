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
  const {extraParams} = route.params;
  const {exercise, profession, subCategory} = extraParams;
  const [results, setResults] = React.useState([]);
  const [message, setMessage] = React.useState('');

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem(exercise).then((value) => {
        const jsonValue = value && JSON.parse(value);
        setResults(Object.values(jsonValue[profession][subCategory]));
      });
    }, [exercise, profession, subCategory]),
  );

  React.useEffect(() => {
    const correctResults = results.filter((doc) => doc.result === 'correct');
    const percentageCorrect = (correctResults.length / results.length) * 100;
    switch (true) {
      case percentageCorrect > 66:
        setMessage('Keep it up!\nYou have mastered the exercise very well.');
        break;

      case percentageCorrect > 33:
        setMessage("You're getting there.\nPlease retry!");
        break;

      case percentageCorrect < 33:
        setMessage(
          'You still have some trouble with the basics,\nplease retry! ',
        );
        break;
    }
  }, [results]);

  const checkResults = () => {
    navigation.navigate(SCREENS.ResultsOverview, {extraParams, results});
  };

  const repeatExercise = () => {
    navigation.navigate(SCREENS.vocabularyTrainer, {
      extraParams,
      retryData: null,
    });
  };

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
        <Text style={styles.lightLabel}>Check my results</Text>
      </Button>

      <Button theme={BUTTONS_THEME.light} onPress={repeatExercise}>
        <RepeatIcon fill={COLORS.lunesBlack} />
        <Text style={styles.darkLabel}>Repeat exercise</Text>
      </Button>
    </View>
  );
};

export default InitialSummaryScreen;
