import {
  React,
  Text,
  View,
  styles,
  IVocabularyOverviewScreen,
  TouchableOpacity,
  Home,
} from './imports';

const VocabularyOverviewExerciseScreen = ({
  navigation,
}: IVocabularyOverviewScreen) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.popToTop()}>
          <Home />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.root}>
      <Text>Vocabulary Overview Exercise Screen</Text>
    </View>
  );
};

export default VocabularyOverviewExerciseScreen;
