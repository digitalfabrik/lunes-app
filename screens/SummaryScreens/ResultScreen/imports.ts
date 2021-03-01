import React from 'react';
import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import {styles} from './styles';
import {IResultScreenProps} from '../../../interfaces/summaryScreens';
import {useFocusEffect} from '@react-navigation/native';
import {SCREENS, BUTTONS_THEME, RESULT_PRESETS} from '../../../constants/data';
import {COLORS} from '../../../constants/colors';
import {
  CircularFinishIcon,
  NextArrow,
  RepeatIcon,
} from '../../../assets/images';
import Title from '../../../components/Title';
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
  TouchableOpacity,
  Title,
  FlatList,
  Loading,
  VocabularyOverviewListItem,
  COLORS,
  Button,
  CircularFinishIcon,
  NextArrow,
  RepeatIcon,
  BUTTONS_THEME,
  RESULT_PRESETS,
};

export type {IResultScreenProps, IDocumentProps};
