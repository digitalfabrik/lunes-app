import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import ProfessionScreen from '../screens/MainScreens/ProfessionScreen';
import ProfessionSubcategoryScreen from '../screens/MainScreens/ProfessionSubcategoryScreen';
import ExercisesScreen from '../screens/Exercises/ExercisesScreens';
import VocabularyOverviewExerciseScreen from '../screens/Exercises/VocabularyOverviewExerciseScreen';
import VocabularyTrainerExerciseScreen from '../screens/Exercises/VocabularyTrainerExerciseScreen';
import {ProfessionParamList} from '../types';
import {BackButton, CloseButton} from '../assets/images/imports';
import {styles} from './styles';
import {Text, TouchableOpacity} from 'react-native';
import InitialSummaryScreen from '../screens/SummaryScreens/InitialSummaryScreen';
import ResultsOverviewScreen from '../screens/SummaryScreens/ResultsOverviewScreen';
import ResultScreen from '../screens/SummaryScreens/ResultScreen';
import {NavigationContainer} from '@react-navigation/native';
import {SCREENS} from '../constants/data';

export {
  React,
  createStackNavigator,
  ProfessionScreen,
  ProfessionSubcategoryScreen,
  ExercisesScreen,
  VocabularyOverviewExerciseScreen,
  VocabularyTrainerExerciseScreen,
  NavigationContainer,
  BackButton,
  CloseButton,
  styles,
  Text,
  TouchableOpacity,
  InitialSummaryScreen,
  ResultsOverviewScreen,
  ResultScreen,
  TransitionPresets,
  SCREENS,
};

export type {ProfessionParamList};
