import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useTheme } from 'styled-components';



import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import OverviewUserVocabularyScreen from '../routes/OverviewUserVocabularyScreen';
import { getLabels } from '../services/helpers';
import { RoutesParams } from './NavigationTypes';
import screenOptions from './screenOptions';
import EditUserVocabularyScreen from '../routes/edit-user-vocabulary/EditUserVocabularyScreen'


const Stack = createStackNavigator<RoutesParams>()

const UserVocabularyStackNavigator = (): JSX.Element | null => {
  const headerHeight = useTabletHeaderHeight(wp('15%'))
  const options = screenOptions(headerHeight)
  const overview = getLabels().general.header.overview
  const theme = useTheme()

  return (
    <Stack.Navigator screenOptions={{ cardStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen
        name='OverviewUserVocabulary'
        component={OverviewUserVocabularyScreen}
        options={({ navigation }) => options(overview, navigation)}
      />
      <Stack.Screen
        name='EditUserVocabulary'
        component={EditUserVocabularyScreen}
        options={({ navigation, route }) => options(route.params.headerBackLabel, navigation)}
      />
    </Stack.Navigator>
  )
}

export default UserVocabularyStackNavigator