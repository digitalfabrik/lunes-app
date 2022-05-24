import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components'

import labels from '../constants/labels.json'
import useReadSelectedProfessions from '../hooks/useReadSelectedProfessions'
import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import DisciplineSelectionScreen from '../routes/DisciplineSelectionScreen'
import ExercisesScreen from '../routes/ExercisesScreen'
import ImprintScreen from '../routes/ImprintScreen'
import ProfessionSelectionScreen from '../routes/ProfessionSelectionScreen'
import ResultDetailScreen from '../routes/ResultDetailScreen'
import ResultScreen from '../routes/ResultScreen'
import AddCustomDisciplineScreen from '../routes/add-custom-discipline/AddCustomDisciplineScreen'
import HomeScreen from '../routes/home/HomeScreen'
import ManageSelectionsScreen from '../routes/manage-selections/ManageSelectionsScreen'
import ScopeSelection from '../routes/scope-selection/ScopeSelectionScreen'
import { RoutesParams } from './NavigationTypes'
import screenOptions from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const HomeStackNavigator = (): JSX.Element | null => {
  const { data: professions, loading } = useReadSelectedProfessions()

  const headerHeight = useTabletHeaderHeight(wp('15%'))
  const options = screenOptions(headerHeight)
  const { manageDisciplines, overview } = labels.general.header
  const theme = useTheme()

  if (loading) {
    return null
  }

  return (
    <Stack.Navigator
      initialRouteName={professions === null ? 'ScopeSelection' : 'Home'}
      screenOptions={{ cardStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name='ScopeSelection'
        component={ScopeSelection}
        initialParams={{ initialSelection: true }}
        options={({ navigation }) => options(manageDisciplines, navigation)}
      />
      <Stack.Screen
        name='DisciplineSelection'
        component={DisciplineSelectionScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
      <Stack.Screen
        name='ProfessionSelection'
        component={ProfessionSelectionScreen}
        options={({ navigation, route }) => options(route.params.discipline.parentTitle ?? overview, navigation)}
      />
      <Stack.Screen
        name='Exercises'
        component={ExercisesScreen}
        options={({ navigation, route }) => options(route.params.discipline.parentTitle ?? overview, navigation)}
      />
      <Stack.Screen name='Result' component={ResultScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name='ResultDetail'
        component={ResultDetailScreen}
        options={({ navigation }) => options(labels.results.resultsOverview, navigation)}
      />
      <Stack.Screen
        name='AddCustomDiscipline'
        component={AddCustomDisciplineScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
      <Stack.Screen
        name='Imprint'
        component={ImprintScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
      <Stack.Screen
        name='ManageDisciplines'
        component={ManageSelectionsScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
    </Stack.Navigator>
  )
}

export default HomeStackNavigator
