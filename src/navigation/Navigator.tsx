import { NavigationContainer, NavigationProp, useNavigation, useNavigationState } from '@react-navigation/native'
import { createStackNavigator, StackNavigationOptions, TransitionPresets } from '@react-navigation/stack'
import React, { ComponentType } from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import { SvgProps } from 'react-native-svg'

import {
  ArrowLeftCircleIconWhite,
  CloseCircleIconWhite,
  ArrowLeftCircleIconBlue,
  HomeCircleIconBlue,
  HomeCircleIconWhite
} from '../../assets/images'
import { NavigationHeaderLeft } from '../components/NavigationHeaderLeft'
import { NavigationTitle } from '../components/NavigationTitle'
import labels from '../constants/labels.json'
import { COLORS } from '../constants/theme/colors'
import { useTabletHeaderHeight } from '../hooks/useTabletHeaderHeight'
import DisciplineSelectionScreen from '../routes/DisciplineSelectionScreen'
import ExercisesScreen from '../routes/ExercisesScreens'
import ImprintScreen from '../routes/ImprintScreen'
import ResultDetailScreen from '../routes/ResultDetailScreen'
import ResultScreen from '../routes/ResultScreen'
import AddCustomDisciplineScreen from '../routes/add-custom-discipline/AddCustomDisciplineScreen'
import ArticleChoiceExerciseScreen from '../routes/choice-exercises/ArticleChoiceExerciseScreen'
import WordChoiceExerciseScreen from '../routes/choice-exercises/WordChoiceExerciseScreen'
import ExerciseFinishedScreen from '../routes/exercise-finished/ExerciseFinishedScreen'
import HomeScreen from '../routes/home/HomeScreen'
import VocabularyListScreen from '../routes/vocabulary-list/VocabularyListScreen'
import WriteExerciseScreen from '../routes/write-exercise/WriteExerciseScreen'
import { RoutesParams } from './NavigationTypes'
import { HomeIcon, StarIcon, FavoriteIcon,BookIcon,HomeDimIcon,StarDimIcon,FavoriteDimIcon,BookDimIcon } from '../../assets/images'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

const styles = (headerHeight?: number) =>
  StyleSheet.create({
    header: {
      backgroundColor: COLORS.background,
      shadowOpacity: 0,
      elevation: 0,
      borderBottomColor: COLORS.disabled,
      borderBottomWidth: 1,
      height: headerHeight
    },
    headerRightContainer: {
      paddingHorizontal: wp('4%'),
      maxWidth: 60
    },
    headerLeftContainer: {
      flex: 1,
      padding: 0
    },
    headerTitleContainer: {
      marginHorizontal: 0
    }
  })

const Stack = createStackNavigator<RoutesParams>()
const Tab = createBottomTabNavigator();

const Navigator = (): JSX.Element => {
  const [isPressed, setIsPressed] = React.useState<boolean>(false)
  const [isHomeButtonPressed, setIsHomeButtonPressed] = React.useState<boolean>(false)
  const [isBottomBarVisable, setIsBottomBarVisable] = React.useState<boolean>(true)

  // Set only height for tablets since header doesn't scale auto
  const headerHeight = useTabletHeaderHeight(wp('15%'))
  
  function StackNav() {
    // { (useNavigationState((state) => state.routes[state.index].name) == 'Exercises') ? setIsBottomBarVisable(false) : null }
    // { console.log(useNavigationState((state) => state.routes[state.index].name)) }
    return(
      <Stack.Navigator initialRouteName='Home' screenOptions={TransitionPresets.SlideFromRightIOS}>
        <Stack.Screen options={{ headerShown: false }} name='Home' component={HomeScreen} />
        <Stack.Screen
          options={({ route, navigation }) =>
            defaultOptions(
              route.params.discipline.parentTitle ?? labels.general.header.overview,
              ArrowLeftCircleIconWhite,
              navigation,
              !!route.params.discipline.parentTitle
            )
          }
          name='DisciplineSelection'
          component={DisciplineSelectionScreen}
        />
        <Stack.Screen
          options={({ route, navigation }) =>
            defaultOptions(
              route.params.discipline.parentTitle ?? labels.general.header.overview,
              ArrowLeftCircleIconWhite,
              navigation,
              true
            )
          }
          name='Exercises'
          component={ExercisesScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.overviewExercises, ArrowLeftCircleIconWhite, navigation, false)
          }
          name='VocabularyList'
          component={VocabularyListScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.cancelExercise, CloseCircleIconWhite, navigation, false)
          }
          name='WordChoiceExercise'
          component={WordChoiceExerciseScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.cancelExercise, CloseCircleIconWhite, navigation, false)
          }
          name='ArticleChoiceExercise'
          component={ArticleChoiceExerciseScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.overviewExercises, CloseCircleIconWhite, navigation, false)
          }
          name='WriteExercise'
          component={WriteExerciseScreen}
        />
        <Stack.Screen options={{ headerShown: false }} name='ExerciseFinished' component={ExerciseFinishedScreen} />
        <Stack.Screen
          options={{
            headerLeft: () => null,
            headerTitle: '',
            headerRightContainerStyle: styles().headerRightContainer
          }}
          name='Result'
          component={ResultScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.results.resultsOverview, ArrowLeftCircleIconWhite, navigation, false)
          }
          name='ResultDetail'
          component={ResultDetailScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.overview, ArrowLeftCircleIconWhite, navigation, false)
          }
          name='AddCustomDiscipline'
          component={AddCustomDisciplineScreen}
        />
        <Stack.Screen
          options={({ navigation }) =>
            defaultOptions(labels.general.header.overview, ArrowLeftCircleIconWhite, navigation, false)
          }
          name='Imprint'
          component={ImprintScreen}
        />
      </Stack.Navigator >
    );
  }
  const defaultOptions = (
    title: string,
    Icon: ComponentType<SvgProps>,
    navigation: NavigationProp<any>,
    showHomeButton: boolean,
    screen?: string
  ): StackNavigationOptions => ({
    headerLeft: () => (
      <NavigationHeaderLeft
        onPress={screen ? () => navigation.navigate(screen) : navigation.goBack}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={1}>
        {isPressed ? (
          <ArrowLeftCircleIconBlue width={wp('7%')} height={wp('7%')} />
        ) : (
          <Icon width={wp('7%')} height={wp('7%')} />
        )}
        <NavigationTitle numberOfLines={2}>{title}</NavigationTitle>
      </NavigationHeaderLeft>
    ),
    ...(showHomeButton && {
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          onPressIn={() => setIsHomeButtonPressed(true)}
          onPressOut={() => setIsHomeButtonPressed(false)}
          activeOpacity={1}>
          {isHomeButtonPressed ? (
            <HomeCircleIconBlue width={wp('7%')} height={wp('7%')} />
          ) : (
            <HomeCircleIconWhite width={wp('7%')} height={wp('7%')} />
          )}
        </TouchableOpacity>
      )
    }),
    headerTitle: '',
    headerStyle: styles(headerHeight).header,
    headerRightContainerStyle: styles().headerRightContainer,
    headerLeftContainerStyle: styles().headerLeftContainer,
    headerTitleContainerStyle: styles().headerTitleContainer
  })
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#fff",
        tabBarStyle: { backgroundColor: COLORS.primary, display:(isBottomBarVisable == false)? "none":"flex" }
  }}>
      <Tab.Screen name="Home" component={StackNav} options={{
            tabBarIcon: ({ focused }) =>  (
            focused
            ? <HomeIcon width={wp('10%')} height={wp('10%')} />
            : <HomeDimIcon width={wp('10%')} height={wp('10%')} />
         )
        }} />
      <Tab.Screen name="Favoriten" component={StackNav} options={{
          tabBarIcon: ({ focused }) =>  (
            focused
            ? <StarIcon width={wp('7%')} height={wp('7%')} />
            : <StarDimIcon width={wp('7%')} height={wp('7%')} />
         )
        }} />
        <Tab.Screen name="Lexikon" component={StackNav} options={{
          tabBarIcon: ({ focused }) =>  (
            focused
            ? <BookIcon width={wp('7%')} height={wp('7%')} />
            : <BookDimIcon width={wp('7%')} height={wp('7%')} />
         )
        }} />
        <Tab.Screen name="Meine vokabeln" component={StackNav}options={{
          tabBarIcon: ({ focused }) =>  (
            focused
            ? <FavoriteIcon width={wp('6%')} height={wp('6%')} />
            : <FavoriteDimIcon width={wp('6%')} height={wp('6%')} />
         )
        }} />
    </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Navigator
