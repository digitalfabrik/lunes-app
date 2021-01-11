import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfessionScreen from '../screens/ProfessionScreen/index';
import ProfessionSubcategoryScreen from '../screens/ProfessionSubcategoryScreen/index';
import ExcerciseScreen from '../screens/ExcerciseScreen/index';
import {ProfessionParamList} from '../types';
import BackButton from '../assets/images/back-button.svg';
import {styles} from './styles';

export {
  React,
  createStackNavigator,
  ProfessionScreen,
  ProfessionSubcategoryScreen,
  ExcerciseScreen,
  BackButton,
  styles,
};

export type {ProfessionParamList};
