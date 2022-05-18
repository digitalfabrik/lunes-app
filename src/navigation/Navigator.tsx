import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

import labels from '../constants/labels.json'
import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import ArticleChoiceExerciseScreen from '../routes/choice-exercises/ArticleChoiceExerciseScreen'
import WordChoiceExerciseScreen from '../routes/choice-exercises/WordChoiceExerciseScreen'
import ExerciseFinishedScreen from '../routes/exercise-finished/ExerciseFinishedScreen'
import VocabularyListScreen from '../routes/vocabulary-list/VocabularyListScreen'
import WriteExerciseScreen from '../routes/write-exercise/WriteExerciseScreen'
import screenOptions from '../services/screenOptions'
import BottomTabNavigator from './BottomTabNavigator'
import { RoutesParams } from './NavigationTypes'

const Stack = createStackNavigator<RoutesParams>()

const HomeStackNavigator = (): JSX.Element | null => {
  const headerHeight = useTabletHeaderHeight(wp('15%'))
  const options = screenOptions(headerHeight)

  const { overviewExercises, cancelExercise } = labels.general.header

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='BottomTabNavigator' component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen
          name='VocabularyList'
          component={VocabularyListScreen}
          options={({ navigation }) => options(overviewExercises, navigation, false)}
        />
        <Stack.Screen
          name='WordChoiceExercise'
          component={WordChoiceExerciseScreen}
          options={({ navigation }) => options(cancelExercise, navigation, true)}
        />
        <Stack.Screen
          name='ArticleChoiceExercise'
          component={ArticleChoiceExerciseScreen}
          options={({ navigation }) => options(cancelExercise, navigation, true)}
        />
        <Stack.Screen
          name='WriteExercise'
          component={WriteExerciseScreen}
          options={({ navigation }) => options(cancelExercise, navigation, true)}
        />
        <Stack.Screen name='ExerciseFinished' component={ExerciseFinishedScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default HomeStackNavigator
