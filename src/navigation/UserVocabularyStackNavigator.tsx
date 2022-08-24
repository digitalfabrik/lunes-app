import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { useTheme } from 'styled-components'

import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import UserVocabularyOverviewScreen from '../routes/UserVocabularyOverviewScreen'
import UserVocabularyCreationScreen from '../routes/user-vocabulary/UserVocabularyCreationScreen'
import { getLabels } from '../services/helpers'
import { RoutesParams } from './NavigationTypes'
import screenOptions from './screenOptions'

const Stack = createStackNavigator<RoutesParams>()

const UserVocabularyStackNavigator = (): JSX.Element | null => {
  const headerHeight = useTabletHeaderHeight(wp('15%'))
  const options = screenOptions(headerHeight)
  const overview = getLabels().general.header.overview
  const theme = useTheme()

  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen
        name='UserVocabularyOverview'
        component={UserVocabularyOverviewScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
      <Stack.Screen
        name='UserVocabularyCreation'
        component={UserVocabularyCreationScreen}
        options={({ navigation, route }) => options(route.params.title, navigation)}
      />
    </Stack.Navigator>
  )
}

export default UserVocabularyStackNavigator
