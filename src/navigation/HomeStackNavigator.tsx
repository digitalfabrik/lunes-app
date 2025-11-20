import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactElement } from 'react'
import { useTheme } from 'styled-components/native'

import ImprintScreen from '../routes/ImprintScreen'
import UnitSelectionScreen from '../routes/UnitSelectionScreen'
import StandardExercisesScreen from '../routes/exercises/StandardExercisesScreen'
import HomeScreen from '../routes/home/HomeScreen'
import ManageSelectionsScreen from '../routes/manage-selections/ManageSelectionsScreen'
import SettingsScreen from '../routes/settings/SettingsScreen'
import SponsorsScreen from '../routes/sponsors/SponsorsScreen'
import { getLabels } from '../services/helpers'
import { RoutesParams } from './NavigationTypes'
import screenOptions, { useTabletHeaderHeight } from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const HomeStackNavigator = (): ReactElement | null => {
  const options = screenOptions(useTabletHeaderHeight())
  const { manageJobs, overview } = getLabels().general.header
  const theme = useTheme()

  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name='UnitSelection'
        component={UnitSelectionScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
      <Stack.Screen
        name='ManageSelection'
        component={ManageSelectionsScreen}
        options={({ navigation }) => options(manageJobs, navigation)}
      />
      <Stack.Screen
        name='StandardExercises'
        component={StandardExercisesScreen}
        options={({ navigation, route }) => options(route.params.unit.title, navigation)}
      />
      <Stack.Screen
        name='Imprint'
        component={ImprintScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
      <Stack.Screen
        name='Sponsors'
        component={SponsorsScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
      <Stack.Screen
        name='Settings'
        component={SettingsScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
    </Stack.Navigator>
  )
}

export default HomeStackNavigator
