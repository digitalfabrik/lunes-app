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
  InitialSummaryScreen,
} from './imports';

const ProfessionStack = createStackNavigator<ProfessionParamList>();

const defaultOptions = (title: string, Icon: any) => {
  return {
    headerLeft: (props: any) => (
      <TouchableOpacity onPress={props.onPress} style={styles.headerLeft}>
        <Icon />
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    ),
    headerTitle: ' ',
    headerStyle: styles.header,
    headerRightContainerStyle: styles.headerRight,
  };
};

const Navigation = () => {
  return (
    <ProfessionStack.Navigator initialRouteName="Profession">
      <ProfessionStack.Screen
        options={{headerShown: false}}
        name="Profession"
        component={ProfessionScreen}
      />
      <ProfessionStack.Screen
        options={defaultOptions('Profession Overview', BackButton)}
        name="ProfessionSubcategory"
        component={ProfessionSubcategoryScreen}
      />
      <ProfessionStack.Screen
        options={({route}: any) =>
          defaultOptions(route.params.extraParams, BackButton)
        }
        name="Exercises"
        component={ExercisesScreen}
      />
      <ProfessionStack.Screen
        options={defaultOptions('Exercise Overview', CloseButton)}
        name="VocabularyOverview"
        component={VocabularyOverviewExerciseScreen}
      />
      <ProfessionStack.Screen
        options={{
          headerTitle: '',
          headerStyle: styles.header,
          headerRightContainerStyle: styles.headerRight,
        }}
        name="VocabularyTrainer"
        component={VocabularyTrainerExerciseScreen}
      />
      <ProfessionStack.Screen
        options={{headerShown: false}}
        name="InitialSummary"
        component={InitialSummaryScreen}
      />
    </ProfessionStack.Navigator>
  );
};

export default Navigation;
