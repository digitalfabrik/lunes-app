import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfessionScreen from '../screens/ProfessionScreen/index';
import ProfessionSubcategoryScreen from '../screens/ProfessionSubcategoryScreen/index';
import {ProfessionParamList} from '../types';
import {BackButton} from '../assets/images/imports';
import {styles} from './styles';

export {
  React,
  createStackNavigator,
  ProfessionScreen,
  ProfessionSubcategoryScreen,
  BackButton,
  styles,
};

export type {ProfessionParamList};
