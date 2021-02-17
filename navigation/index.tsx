import {SCREENS} from '../constants/data';
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
  CorrectResultsScreen,
  AlmostCorrectResultsScreen,
  IncorrectResultsScreen,
  NavigationContainer,
} from './imports';

const ProfessionStack = createStackNavigator<ProfessionParamList>();

const Navigation = () => {
  const defaultOptions = (
    title: string,
    Icon: any,
    navigation: any,
    screen?: string,
  ) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          onPress={
            screen ? () => navigation.navigate(screen) : navigation.goBack
          }
          style={styles.headerLeft}>
          <Icon />
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
      ),
      headerTitle: ' ',
      headerStyle: styles.header,
      headerRightContainerStyle: styles.headerRight,
    };
  };

  return (
    <NavigationContainer>
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
        <ProfessionStack.Screen
          options={({navigation}) =>
            defaultOptions(
              'Results Overview',
              BackButton,
              navigation,
              SCREENS.ResultsOverview,
            )
          }
          name="CorrectResults"
          component={CorrectResultsScreen}
        />
        <ProfessionStack.Screen
          options={({navigation}) =>
            defaultOptions(
              'Results Overview',
              BackButton,
              navigation,
              SCREENS.ResultsOverview,
            )
          }
          name="AlmostCorrectResults"
          component={AlmostCorrectResultsScreen}
        />
        <ProfessionStack.Screen
          options={({navigation}) =>
            defaultOptions(
              'Results Overview',
              BackButton,
              navigation,
              SCREENS.ResultsOverview,
            )
          }
          name="IncorrectResults"
          component={IncorrectResultsScreen}
        />
      </ProfessionStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
