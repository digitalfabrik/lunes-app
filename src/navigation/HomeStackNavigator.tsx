import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components'

import labels from '../constants/labels.json'
import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import DisciplineSelectionScreen from '../routes/DisciplineSelectionScreen'
import ImprintScreen from '../routes/ImprintScreen'
import AddCustomDisciplineScreen from '../routes/add-custom-discipline/AddCustomDisciplineScreen'
import ExercisesScreen from '../routes/exercises/ExercisesScreen'
import HomeScreen from '../routes/home/HomeScreen'
import ManageSelectionsScreen from '../routes/manage-selections/ManageSelectionsScreen'
import SettingsScreen from '../routes/settings/SettingsScreen'
import { RoutesParams } from './NavigationTypes'
import screenOptions from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const HomeStackNavigator = (): JSX.Element | null => {
  const headerHeight = useTabletHeaderHeight(wp('15%'))
  const options = screenOptions(headerHeight)
  const { overview } = labels.general.header
  const theme = useTheme()

  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name='DisciplineSelection'
        component={DisciplineSelectionScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
      <Stack.Screen
        name='Exercises'
        component={ExercisesScreen}
        options={({ navigation, route }) => options(route.params.discipline.parentTitle ?? overview, navigation)}
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
        name='ManageSelection'
        component={ManageSelectionsScreen}
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
