import {
  React,
  styles,
  View,
  Text,
  LogBox,
  IExercisesScreenProps,
  TouchableOpacity,
  Home,
  ListView,
  EXERCISES,
} from './imports';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ExercisesScreen = ({route, navigation}: IExercisesScreenProps) => {
  const {extraParams} = route.params;

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
      <ListView
        title={
          <>
            <Text style={styles.title}>{extraParams}</Text>
            <Text style={styles.description}>2 Excercises</Text>
          </>
        }
        listData={EXERCISES}
        navigation={navigation}
      />
    </View>
  );
};

export default ExercisesScreen;
