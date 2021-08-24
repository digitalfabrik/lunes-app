import React from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import ProfessionScreen from '../routes/ProfessionScreen'
import ProfessionSubcategoryScreen from '../routes/ProfessionSubcategoryScreen'
import ExercisesScreen from '../routes/ExercisesScreens'
import VocabularyListScreen from '../routes/vocabulary-list/VocabularyListScreen'
import WriteExerciseScreen from '../routes/write-exercise/WriteExerciseScreen'
import { RoutesParamsType } from './NavigationTypes'
import { BackButton, CloseButton, BackArrowPressed } from '../../assets/images'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import InitialSummaryScreen from '../routes/InitialSummaryScreen'
import ResultsOverviewScreen from '../routes/ResultsOverviewScreen'
import ResultScreen from '../routes/ResultScreen'
import { NavigationContainer } from '@react-navigation/native'
import { COLORS } from '../constants/colors'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import WordChoiceExerciseScreen from '../routes/choice-exercises/WordChoiceExerciseScreen'
import ArticleChoiceExerciseScreen from '../routes/choice-exercises/ArticleChoiceExerciseScreen'
import labels from '../constants/labels.json'

export const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.lunesWhite,
    shadowOpacity: 0,
    elevation: 0,
    borderBottomColor: COLORS.lunesBlackUltralight,
    borderBottomWidth: 1
  },
  title: {
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('4%'),
    textTransform: 'uppercase',
    fontWeight: '600',
    marginLeft: 15
  },
  headerLeft: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100
  },
  headerRight: {
    paddingRight: 15
  }
})

const Stack = createStackNavigator<RoutesParamsType>()

const Navigator = (): JSX.Element => {
  const [isPressed, setIsPressed] = React.useState(false)

  const defaultOptions = (title: string, Icon: any, navigation: any, screen?: string): {} => {
    return {
      headerLeft: () => (
        <TouchableOpacity onPress={screen ? () => navigation.navigate(screen) : navigation.goBack}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}
          style={styles.headerLeft}>
          {isPressed ? <BackArrowPressed /> : <Icon />}
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
      ),
      headerTitle: ' ',
      headerStyle: styles.header,
      headerRightContainerStyle: styles.headerRight
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Profession' screenOptions={TransitionPresets.SlideFromRightIOS}>
        <Stack.Screen options={{ headerShown: false }} name='Profession' component={ProfessionScreen} />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.overview, BackButton, navigation)
          }
          name='ProfessionSubcategory'
          component={ProfessionSubcategoryScreen}
        />
        <Stack.Screen
          options={({ route, navigation }: any) =>
            defaultOptions(route.params.extraParams.disciplineTitle, BackButton, navigation)
          }
          name='Exercises'
          component={ExercisesScreen}
        />
        <Stack.Screen
          options={({ navigation }) => defaultOptions(labels.general.header.overviewExercises, BackButton, navigation)}
          name='VocabularyList'
          component={VocabularyListScreen}
        />
        <Stack.Screen
          options={({ navigation }) => defaultOptions(labels.general.header.cancelExercise, CloseButton, navigation)}
          name='WordChoiceExercise'
          component={WordChoiceExerciseScreen}
        />
        <Stack.Screen
          options={({ navigation }) => defaultOptions(labels.general.header.cancelExercise, CloseButton, navigation)}
          name='ArticleChoiceExercise'
          component={ArticleChoiceExerciseScreen}
        />
        <Stack.Screen
          options={({ navigation }) => defaultOptions(labels.general.header.overviewExercises, CloseButton, navigation)}
          name='WriteExercise'
          component={WriteExerciseScreen}
        />
        <Stack.Screen options={{ headerShown: false }} name='InitialSummary' component={InitialSummaryScreen} />
        <Stack.Screen
          options={{
            headerLeft: () => null,
            headerTitle: ' ',
            headerRightContainerStyle: styles.headerRight
          }}
          name='ResultsOverview'
          component={ResultsOverviewScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.results.resultsOverview, BackButton, navigation, 'ResultsOverview')
          }
          name='ResultScreen'
          component={ResultScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator
