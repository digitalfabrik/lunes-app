import React from 'react';
import {View, Text, Pressable, FlatList} from 'react-native';
import {styles} from './styles';
import Title from '../../../components/Title';
import {Arrow, RepeatIcon} from '../../../assets/images/imports';
import {COLORS} from '../../../constants/colors';
import {RESULTS, BUTTONS_THEME, SCREENS} from '../../../constants/data';
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
  useFocusEffect,
  AsyncStorage,
  Button,
  BUTTONS_THEME,
  SCREENS,
  RepeatIcon,
};

export type {IResultsOverviewScreenProps};
