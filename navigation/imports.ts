import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfessionScreen from '../screens/MainScreens/ProfessionScreen/index';
import ProfessionSubcategoryScreen from '../screens/MainScreens/ProfessionSubcategoryScreen/index';
import ExercisesScreen from '../screens/ExercisesScreens/index';
import VocabularyOverviewExerciseScreen from '../screens/ExercisesScreens/VocabularyOverviewExerciseScreen/index';
import VocabularyTrainerExerciseScreen from '../screens/ExercisesScreens/VocabularyTrainerExerciseScreen/index';
import {ProfessionParamList} from '../types';
import {BackButton, CloseButton} from '../assets/images/imports';
import {styles} from './styles';
import {Text, TouchableOpacity} from 'react-native';
import InitialSummaryScreen from '../screens/SummaryScreens/InitialSummaryScreen/imdex';

export {
  React,
  createStackNavigator,
  ProfessionScreen,
  ProfessionSubcategoryScreen,
  ExercisesScreen,
  VocabularyOverviewExerciseScreen,
  VocabularyTrainerExerciseScreen,
  BackButton,
  CloseButton,
  styles,
  Text,
  TouchableOpacity,
  InitialSummaryScreen,
};

export type {ProfessionParamList};
