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
} from './imports';

const InitialSummaryScreen = ({
  navigation,
  route,
}: IInitialSummaryScreenProps) => {
  const {description, title, Level, totalCount} = route.params;

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

  return (
    <View style={styles.root}>
      <View style={styles.upperSection}>
        <CheckIcon />
        <View style={styles.messageContainer}>
          <Text style={styles.message}>
            Keep it up!{'\n'}
            You have mastered the excercise very well.
          </Text>
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
