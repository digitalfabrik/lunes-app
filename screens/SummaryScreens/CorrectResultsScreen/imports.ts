import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {styles} from './styles';
import {IResultScreenProps} from '../../../interfaces/summaryScreens';
import {useFocusEffect} from '@react-navigation/native';
import {SCREENS} from '../../../constants/data';
import {COLORS} from '../../../constants/colors';
import {CircularFinishIcon, CorrectIcon} from '../../../assets/images/imports';
import Title from '../../../components/Title';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../../../components/Loading';
import VocabularyOverviewListItem from '../../../components/VocabularyOverviewListItem';
import {IDocumentProps} from '../../../interfaces/exercise';

export {
  React,
  View,
  Text,
  styles,
  useFocusEffect,
  SCREENS,
  CircularFinishIcon,
  TouchableOpacity,
  Title,
  FlatList,
  AsyncStorage,
  Loading,
  VocabularyOverviewListItem,
  COLORS,
  CorrectIcon,
};

export type {IResultScreenProps, IDocumentProps};
