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
  ResultsOverviewScreen,
} from './imports';

const ProfessionStack = createStackNavigator<ProfessionParamList>();

const defaultOptions = (title: string, Icon: any, navigation: any) => {
  return {
    headerLeft: () => (
      <TouchableOpacity onPress={navigation.goBack} style={styles.headerLeft}>
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
        options={({navigation}) =>
          defaultOptions('Profession Overview', BackButton, navigation)
        }
        name="ProfessionSubcategory"
        component={ProfessionSubcategoryScreen}
      />
      <ProfessionStack.Screen
        options={({route, navigation}: any) =>
          defaultOptions(route.params.extraParams, BackButton, navigation)
        }
        name="Exercises"
        component={ExercisesScreen}
      />
      <ProfessionStack.Screen
        options={({navigation}) =>
          defaultOptions('Exercise Overview', CloseButton, navigation)
        }
        name="VocabularyOverview"
        component={VocabularyOverviewExerciseScreen}
      />
      <ProfessionStack.Screen
        options={({navigation}) =>
          defaultOptions('Exercise Overview', CloseButton, navigation)
        }
        name="VocabularyTrainer"
        component={VocabularyTrainerExerciseScreen}
      />
      <ProfessionStack.Screen
        options={{headerShown: false}}
        name="InitialSummary"
        component={InitialSummaryScreen}
      />
      <ProfessionStack.Screen
        options={{
          headerLeft: () => null,
          headerTitle: ' ',
          headerRightContainerStyle: styles.headerRight,
        }}
        name="ResultsOverview"
        component={ResultsOverviewScreen}
      />
    </ProfessionStack.Navigator>
  );
};

export default Navigation;
