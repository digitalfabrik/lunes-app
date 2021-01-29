import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfessionScreen from '../screens/MainScreens/ProfessionScreen';
import ProfessionSubcategoryScreen from '../screens/MainScreens/ProfessionSubcategoryScreen';
import ExercisesScreen from '../screens/Exercises/ExercisesScreens';
import VocabularyOverviewExerciseScreen from '../screens/Exercises/VocabularyOverviewExerciseScreen';
import VocabularyTrainerExerciseScreen from '../screens/Exercises/VocabularyTrainerExerciseScreen';
import {ProfessionParamList} from '../types';
import {BackButton, CloseButton} from '../assets/images/imports';
import {styles} from './styles';
import {Text, TouchableOpacity} from 'react-native';

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
};

export type {ProfessionParamList};
