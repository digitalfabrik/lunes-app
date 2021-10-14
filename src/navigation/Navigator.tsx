import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import { BackButton, CloseButton, BackArrowPressed, HomeButtonPressed, Home } from '../../assets/images'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import DisciplineSelectionScreen from '../routes/DisciplineSelectionScreen'
import ExercisesScreen from '../routes/ExercisesScreens'
import HomeScreen from '../routes/HomeScreen'
import InitialSummaryScreen from '../routes/InitialSummaryScreen'
import ResultScreen from '../routes/ResultScreen'
import ResultsOverviewScreen from '../routes/ResultsOverviewScreen'
import ArticleChoiceExerciseScreen from '../routes/choice-exercises/ArticleChoiceExerciseScreen'
import WordChoiceExerciseScreen from '../routes/choice-exercises/WordChoiceExerciseScreen'
import VocabularyListScreen from '../routes/vocabulary-list/VocabularyListScreen'
import WriteExerciseScreen from '../routes/write-exercise/WriteExerciseScreen'
import { RoutesParamsType } from './NavigationTypes'

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
    marginLeft: 15,
    letterSpacing: 0.4
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
  const [isPressed, setIsPressed] = React.useState<boolean>(false)
  const [isHomeButtonPressed, setIsHomeButtonPressed] = React.useState<boolean>(false)

  const defaultOptions = (title: string, Icon: any, navigation: any, showHomeButton: boolean, screen?: string): {} => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          onPress={screen ? () => navigation.navigate(screen) : navigation.goBack}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}
          style={styles.headerLeft}>
          {isPressed ? <BackArrowPressed /> : <Icon />}
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
      ),
      ...(showHomeButton && {
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            onPressIn={() => setIsHomeButtonPressed(true)}
            onPressOut={() => setIsHomeButtonPressed(false)}
            activeOpacity={1}>
            {isHomeButtonPressed ? <HomeButtonPressed /> : <Home />}
          </TouchableOpacity>
        )
      }),
      headerTitle: ' ',
      headerStyle: styles.header,
      headerRightContainerStyle: styles.headerRight
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={TransitionPresets.SlideFromRightIOS}>
        <Stack.Screen options={{ headerShown: false }} name='Home' component={HomeScreen} />
        <Stack.Screen
          options={({ route, navigation }) =>
            defaultOptions(
              route.params.extraParams.parentTitle
                ? route.params.extraParams.parentTitle
                : labels.general.header.overview,
              BackButton,
              navigation,
              !!route.params.extraParams.parentTitle
            )
          }
          name='DisciplineSelection'
          component={DisciplineSelectionScreen}
        />
        <Stack.Screen
          options={({ route, navigation }: any) =>
            defaultOptions(route.params.discipline.title, BackButton, navigation, true)
          }
          name='Exercises'
          component={ExercisesScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.overviewExercises, BackButton, navigation, false)
          }
          name='VocabularyList'
          component={VocabularyListScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.cancelExercise, CloseButton, navigation, false)
          }
          name='WordChoiceExercise'
          component={WordChoiceExerciseScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.cancelExercise, CloseButton, navigation, false)
          }
          name='ArticleChoiceExercise'
          component={ArticleChoiceExerciseScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.overviewExercises, CloseButton, navigation, false)
          }
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
            defaultOptions(labels.results.resultsOverview, BackButton, navigation, false, 'ResultsOverview')
          }
          name='ResultScreen'
          component={ResultScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator
