import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import ProfessionScreen from './screens/MainScreens/ProfessionScreen';
import ProfessionSubcategoryScreen from './screens/MainScreens/ProfessionSubcategoryScreen';
import ExercisesScreen from './screens/Exercises/ExercisesScreens';
import VocabularyOverviewExerciseScreen from './screens/Exercises/VocabularyOverviewExerciseScreen';
import VocabularyTrainerExerciseScreen from './screens/Exercises/VocabularyTrainerExerciseScreen';
import {ProfessionParamList} from '../types';
import {BackButton, CloseButton, BackArrowPressed} from '../assets/images';
import {Text, TouchableOpacity} from 'react-native';
import InitialSummaryScreen from './screens/SummaryScreens/InitialSummaryScreen';
import ResultsOverviewScreen from './screens/SummaryScreens/ResultsOverviewScreen';
import ResultScreen from './screens/SummaryScreens/ResultScreen';
import {NavigationContainer} from '@react-navigation/native';
import {SCREENS} from './constants/data';
import {StyleSheet} from 'react-native';
import {COLORS} from './constants/colors';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.lunesWhite,
    shadowOpacity: 0,
    elevation: 0,
    borderBottomColor: COLORS.lunesBlackUltralight,
    borderBottomWidth: 1,
  },
  title: {
    color: COLORS.lunesBlack,
    fontFamily: 'SourceSansPro-SemiBold',
    fontSize: wp('4%'),
    textTransform: 'uppercase',
    fontWeight: '600',
    marginLeft: 15,
  },
  headerLeft: {
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  headerRight: {
    paddingRight: 15,
  },
});

const ProfessionStack = createStackNavigator<ProfessionParamList>();

const Navigation = () => {
  const [isPressed, setIsPressed] = React.useState(false);

  const defaultOptions = (
    title: string,
    Icon: any,
    navigation: any,
    screen?: string,
  ) => {
    return {
      headerLeft: () => (
        <TouchableOpacity
          onPress={
            screen ? () => navigation.navigate(screen) : navigation.goBack
          }
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          activeOpacity={1}
          style={styles.headerLeft}>
          {isPressed ? <BackArrowPressed /> : <Icon />}
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
      ),
      headerTitle: ' ',
      headerStyle: styles.header,
      headerRightContainerStyle: styles.headerRight,
    };
  };

  return (
    <NavigationContainer>
      <ProfessionStack.Navigator
        initialRouteName="Profession"
        screenOptions={TransitionPresets.SlideFromRightIOS}>
        <ProfessionStack.Screen
          options={{headerShown: false}}
          name="Profession"
          component={ProfessionScreen}
        />
        <ProfessionStack.Screen
          options={({navigation}) =>
            defaultOptions(
              'Profession Overview',
              BackButton,
              navigation,
              'Profession',
            )
          }
          name="ProfessionSubcategory"
          component={ProfessionSubcategoryScreen}
        />
        <ProfessionStack.Screen
          options={({route, navigation}: any) =>
            defaultOptions(
              route.params.extraParams.disciplineTitle,
              BackButton,
              navigation,
              'ProfessionSubcategory',
            )
          }
          name="Exercises"
          component={ExercisesScreen}
        />
        <ProfessionStack.Screen
          options={({navigation}) =>
            defaultOptions('Exercise Overview', BackButton, navigation)
          }
          name="VocabularyOverview"
          component={VocabularyOverviewExerciseScreen}
        />
        <ProfessionStack.Screen
          options={({navigation}) =>
            defaultOptions('Exercise Overview', CloseButton, navigation)
          }
          name="VocabularyTrainer"
          component={VocabularyTrainerExerciseScreen}
        />
        <ProfessionStack.Screen
          options={{headerShown: false}}
          name="InitialSummary"
          component={InitialSummaryScreen}
        />
        <ProfessionStack.Screen
          options={{
            headerLeft: () => null,
            headerTitle: ' ',
            headerRightContainerStyle: styles.headerRight,
          }}
          name="ResultsOverview"
          component={ResultsOverviewScreen}
        />
        <ProfessionStack.Screen
          options={({navigation}) =>
            defaultOptions(
              'Results Overview',
              BackButton,
              navigation,
              SCREENS.ResultsOverview,
            )
          }
          name="ResultScreen"
          component={ResultScreen}
        />
      </ProfessionStack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
