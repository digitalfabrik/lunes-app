import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {styles} from './styles';
import {IResultScreenProps} from '../../../interfaces/summaryScreens';
import {useFocusEffect} from '@react-navigation/native';
import {SCREENS} from '../../../constants/data';
import {COLORS} from '../../../constants/colors';
import {
  CircularFinishIcon,
  CorrectIcon,
  NextArrow,
} from '../../../assets/images/imports';
import Title from '../../../components/Title';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../../../components/Loading';
import VocabularyOverviewListItem from '../../../components/VocabularyOverviewListItem';
import {IDocumentProps} from '../../../interfaces/exercise';
import Button from '../../../components/Button';

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
  Button,
  NextArrow,
};

export type {IResultScreenProps, IDocumentProps};
