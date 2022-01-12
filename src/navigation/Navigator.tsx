import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack'
import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import styled from 'styled-components/native'

import { BackButton, CloseButton, BackArrowPressed, HomeButtonPressed, Home } from '../../assets/images'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import AddCustomDisciplineScreen from '../routes/AddCustomDisciplineScreen'
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
  headerRightContainer: {
    paddingRight: 15,
    flexShrink: 1
  },
  headerLeftContainer: {
    flexGrow: 3
  }
})

export const NavigationTitle = styled.Text`
  color: ${props => props.theme.colors.lunesBlack};
  font-family: ${props => props.theme.fonts.contentFontBold};
  font-size: ${props => props.theme.fonts.defaultFontSize};
  letter-spacing: ${props => props.theme.fonts.capsLetterSpacing};
  text-transform: uppercase;
  font-weight: ${props => props.theme.fonts.defaultFontWeight};
  padding-left: 15px;
  flex: 1;
`

export const NavigationHeaderLeft = styled.TouchableOpacity`
  padding-left: 15px;
  flex-direction: row;
  align-items: center;
`

const Stack = createStackNavigator<RoutesParamsType>()

const Navigator = (): JSX.Element => {
  const [isPressed, setIsPressed] = React.useState<boolean>(false)
  const [isHomeButtonPressed, setIsHomeButtonPressed] = React.useState<boolean>(false)

  const defaultOptions = (title: string, Icon: any, navigation: any, showHomeButton: boolean, screen?: string): {} => {
    return {
      headerLeft: () => (
        <NavigationHeaderLeft
          onPress={screen ? () => navigation.navigate(screen) : navigation.goBack}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}>
          {isPressed ? <BackArrowPressed /> : <Icon />}
          <NavigationTitle>{title}</NavigationTitle>
        </NavigationHeaderLeft>
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
      headerTitle: '',
      headerStyle: styles.header,
      headerRightContainerStyle: styles.headerRightContainer,
      headerLeftContainerStyle: styles.headerLeftContainer
    }
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={TransitionPresets.SlideFromRightIOS}>
        <Stack.Screen options={{ headerShown: false }} name='Home' component={HomeScreen} />
        <Stack.Screen
          options={({ route, navigation }) =>
            defaultOptions(
              route.params.parentTitle ?? labels.general.header.overview,
              BackButton,
              navigation,
              !!route.params.parentTitle
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
            headerRightContainerStyle: styles.headerRightContainer
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
        <Stack.Screen
          options={({ navigation }) => defaultOptions(labels.general.header.overview, BackButton, navigation, false)}
          name='AddCustomDiscipline'
          component={AddCustomDisciplineScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator
