import {
  React,
  createStackNavigator,
  ProfessionScreen,
  ProfessionSubcategoryScreen,
  ExercisesScreen,
  VocabularyOverviewExerciseScreen,
  VocabularyTrainerExerciseScreen,
  BackButton,
  CloseButton,
  styles,
  ProfessionParamList,
  Text,
  TouchableOpacity,
} from './imports';

const ProfessionStack = createStackNavigator<ProfessionParamList>();

const Navigation = () => {
  return (
    <ProfessionStack.Navigator initialRouteName="Profession">
      <ProfessionStack.Screen
        options={{headerShown: false}}
        name="Profession"
        component={ProfessionScreen}
      />
      <ProfessionStack.Screen
        options={{
          headerLeft: (props) => (
            <TouchableOpacity onPress={props.onPress} style={styles.headerLeft}>
              <BackButton />
              <Text style={styles.title}>Profession Overview</Text>
            </TouchableOpacity>
          ),
          headerTitle: ' ',
          headerStyle: styles.header,
        }}
        name="ProfessionSubcategory"
        component={ProfessionSubcategoryScreen}
      />
      <ProfessionStack.Screen
        options={({route}: any) => ({
          headerLeft: (props) => (
            <TouchableOpacity onPress={props.onPress} style={styles.headerLeft}>
              <BackButton />
              <Text style={styles.title}>{route.params.extraParams}</Text>
            </TouchableOpacity>
          ),
          headerTitle: ' ',
          headerStyle: styles.header,
          headerRightContainerStyle: styles.headerRight,
        })}
        name="Exercises"
        component={ExercisesScreen}
      />
      <ProfessionStack.Screen
        options={{
          headerLeft: (props) => (
            <TouchableOpacity onPress={props.onPress} style={styles.headerLeft}>
              <CloseButton />
              <Text style={styles.title}>Exercise Overview</Text>
            </TouchableOpacity>
          ),
          headerTitle: ' ',
          headerStyle: styles.header,
          headerRightContainerStyle: styles.headerRight,
        }}
        name="VocabularyOverview"
        component={VocabularyOverviewExerciseScreen}
      />
      <ProfessionStack.Screen
        options={{
          headerBackImage: () => <BackButton />,
          headerTitleStyle: styles.title,
          headerStyle: styles.header,
          headerRightContainerStyle: styles.headerRight,
        }}
        name="VocabularyTrainer"
        component={VocabularyTrainerExerciseScreen}
      />
    </ProfessionStack.Navigator>
  );
};

export default Navigation;
