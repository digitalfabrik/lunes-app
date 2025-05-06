import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components/native'

import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import UserVocabularyOverviewScreen from '../routes/UserVocabularyOverviewScreen'
import { EditableVocabularyDetailsScreen } from '../routes/VocabularyDetailScreen'
import UserVocabularyProcessScreen from '../routes/process-user-vocabulary/UserVocabularyProcessScreen'
import SpecialExercisesScreen from '../routes/special-exercises/SpecialExercisesScreen'
import UserVocabularyDisciplineSelectionScreen from '../routes/user-vocabulary-discipline-selection/UserVocabularyDisciplineSelectionScreen'
import UserVocabularyListScreen from '../routes/user-vocabulary-list/UserVocabularyListScreen'
import { getLabels } from '../services/helpers'
import { RoutesParams } from './NavigationTypes'
import screenOptions from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const UserVocabularyStackNavigator = (): JSX.Element | null => {
  const headerHeight = useTabletHeaderHeight(hp('7.5%'))
  const options = screenOptions(headerHeight)
  const back = getLabels().general.back
  const theme = useTheme()

  return (
    <Stack.Navigator
      screenOptions={{ cardStyle: { backgroundColor: theme.colors.background }, headerStatusBarHeight: 0 }}>
      <Stack.Screen
        name='UserVocabularyOverview'
        component={UserVocabularyOverviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='UserVocabularyList'
        component={UserVocabularyListScreen}
        options={({ navigation }) => options(back, navigation)}
      />
      <Stack.Screen
        name='VocabularyDetail'
        component={EditableVocabularyDetailsScreen}
        options={({ navigation }) => options(back, navigation)}
      />
      <Stack.Screen
        name='UserVocabularyProcess'
        component={UserVocabularyProcessScreen}
        options={({ navigation }) => options(back, navigation)}
      />
      <Stack.Screen
        name='UserVocabularyDisciplineSelection'
        component={UserVocabularyDisciplineSelectionScreen}
        options={({ navigation }) => options(back, navigation)}
      />
      <Stack.Screen
        name='SpecialExercises'
        component={SpecialExercisesScreen}
        options={({ navigation }) => options(back, navigation)}
      />
    </Stack.Navigator>
  )
}

export default UserVocabularyStackNavigator
