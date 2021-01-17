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
          headerTitle: 'Profession Overview',
          headerBackImage: () => <BackButton />,
          headerTitleStyle: styles.title,
          headerStyle: styles.header,
        }}
        name="ProfessionSubcategory"
        component={ProfessionSubcategoryScreen}
      />
      <ProfessionStack.Screen
        options={({route}: any) => ({
          headerTitle: route.params.extraParams,
          headerBackImage: () => <BackButton />,
          headerTitleStyle: styles.title,
          headerStyle: styles.header,
          headerRightContainerStyle: styles.rightHeaderComponent,
        })}
        name="Exercises"
        component={ExercisesScreen}
      />
      <ProfessionStack.Screen
        options={{
          headerTitle: 'Excercise Overview',
          headerBackImage: () => <CloseButton />,
          headerTitleStyle: styles.title,
          headerStyle: styles.header,
          headerRightContainerStyle: styles.rightHeaderComponent,
        }}
        name="VocabularyOverview"
        component={VocabularyOverviewExerciseScreen}
      />
      <ProfessionStack.Screen
        options={{
          headerTitle: 'End Session',
          headerTitleStyle: styles.title,
          headerStyle: styles.header,
        }}
        name="VocabularyTrainer"
        component={VocabularyTrainerExerciseScreen}
      />
    </ProfessionStack.Navigator>
  );
};

export default Navigation;
