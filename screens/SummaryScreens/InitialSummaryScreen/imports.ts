import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';
import Button from '../../../components/Button';
import {CheckIcon, ListIcon, RepeatIcon} from '../../../assets/images/imports';
import {BUTTONS_THEME, SCREENS} from '../../../constants/data';
import {IInitialSummaryScreenProps} from '../../../interfaces/summaryScreens';
import {COLORS} from '../ResultsScreen/imports';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';

export {
  React,
  View,
  Text,
  styles,
  Button,
  CheckIcon,
  ListIcon,
  RepeatIcon,
  BUTTONS_THEME,
  SCREENS,
  COLORS,
  useFocusEffect,
  AsyncStorage,
};

export type {IInitialSummaryScreenProps};
