import { createStackNavigator } from '@react-navigation/stack'
import React, { type JSX } from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'

import useStorage from '../hooks/useStorage'
import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import OverlayMenu, { OverlayTransition } from '../routes/OverlayMenuScreen'
import ProfessionSelectionScreen from '../routes/ProfessionSelectionScreen'
import VocabularyListScreen from '../routes/VocabularyListScreen'
import ArticleChoiceExerciseScreen from '../routes/choice-exercises/ArticleChoiceExerciseScreen'
import WordChoiceExerciseScreen from '../routes/choice-exercises/WordChoiceExerciseScreen'
import ExerciseFinishedScreen from '../routes/exercise-finished/ExerciseFinishedScreen'
import ScopeSelection from '../routes/scope-selection/ScopeSelectionScreen'
import VocabularyDetailExerciseScreen from '../routes/vocabulary-detail-exercise/VocabularyDetailExerciseScreen'
import WriteExerciseScreen from '../routes/write-exercise/WriteExerciseScreen'
import { getLabels } from '../services/helpers'
import BottomTabNavigator from './BottomTabNavigator'
import { RoutesParams } from './NavigationTypes'
import screenOptions from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const HomeStackNavigator = (): JSX.Element | null => {
  const [professions] = useStorage('selectedProfessions')

  const headerHeight = useTabletHeaderHeight(hp('7.5%'))
  const options = screenOptions(headerHeight)

  const { manageSelection, overviewExercises, cancelExercise, overview } = getLabels().general.header

  return (
    <Stack.Navigator initialRouteName={professions === null ? 'ScopeSelection' : 'BottomTabNavigator'}>
      <Stack.Screen name='BottomTabNavigator' component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen
        name='ScopeSelection'
        component={ScopeSelection}
        initialParams={{ initialSelection: true }}
        options={({ navigation }) => options(manageSelection, navigation)}
      />
      <Stack.Screen
        name='OverlayMenu'
        component={OverlayMenu}
        options={{ presentation: 'transparentModal', headerShown: false, ...OverlayTransition }}
      />
      <Stack.Screen
        name='ProfessionSelection'
        component={ProfessionSelectionScreen}
        options={({ navigation, route }) => options(route.params.discipline.parentTitle ?? overview, navigation)}
      />
      <Stack.Screen
        name='VocabularyList'
        component={VocabularyListScreen}
        options={({ navigation }) => options(overviewExercises, navigation, false)}
      />
      <Stack.Screen
        name='VocabularyDetailExercise'
        component={VocabularyDetailExerciseScreen}
        options={({ navigation }) => options('', navigation, true)}
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
  )
}

export default HomeStackNavigator
