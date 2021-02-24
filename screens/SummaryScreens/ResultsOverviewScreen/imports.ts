import React from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {styles} from './styles';
import Title from '../../../components/Title';
import {Arrow, RepeatIcon, FinishIcon} from '../../../assets/images/imports';
import {COLORS} from '../../../constants/colors';
import {
  RESULTS,
  BUTTONS_THEME,
  SCREENS,
  RESULT_TYPE,
  EXERCISES,
} from '../../../constants/data';
import {IResultsOverviewScreenProps} from '../../../interfaces/summaryScreens';
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Button from '../../../components/Button';

export {
  React,
  View,
  Text,
  styles,
  Title,
  Pressable,
  Arrow,
  COLORS,
  RESULTS,
  FlatList,
  RESULT_TYPE,
  useFocusEffect,
  AsyncStorage,
  Button,
  BUTTONS_THEME,
  SCREENS,
  RepeatIcon,
  TouchableOpacity,
  FinishIcon,
  StatusBar,
  EXERCISES,
};

export type {IResultsOverviewScreenProps};
