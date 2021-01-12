import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfessionScreen from '../screens/ProfessionScreen/index';
import ProfessionSubcategoryScreen from '../screens/ProfessionSubcategoryScreen/index';
import ExercisesScreen from '../screens/ExercisesScreen/index';
import VocabularyOverviewExerciseScreen from '../screens/VocabularyOverviewExerciseScreen/index';
import VocabularyTrainerExerciseScreen from '../screens/VocabularyTrainerExerciseScreen/index';
import {ProfessionParamList} from '../types';
import BackButton from '../assets/images/back-button.svg';
import {styles} from './styles';

export {
  React,
  createStackNavigator,
  ProfessionScreen,
  ProfessionSubcategoryScreen,
  ExercisesScreen,
  VocabularyOverviewExerciseScreen,
  VocabularyTrainerExerciseScreen,
  BackButton,
  styles,
};

export type {ProfessionParamList};
